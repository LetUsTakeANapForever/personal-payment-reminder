import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { discordPaymentDocument, payment } from "@/lib/db/schema";

type JsonRecord = Record<string, unknown>;

export type CreateDiscordPaymentInput = {
  userId: string;
  accountId: string;
  discordUserId: string;
  paymentType: string;
  paymentData: Record<string, unknown>;
  guildId?: string | null;
  channelId?: string | null;
  source?: string | null;
};

type DiscordPaymentDocument = typeof discordPaymentDocument.$inferSelect;

const toDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

const addMonths = (date: Date, months: number) => {
  const next = new Date(date);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
};

const asNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const asPositiveInteger = (value: unknown) =>
  typeof value === "number" && Number.isInteger(value) && value > 0 ? value : null;

const asDecimal = (value: unknown): string | null => {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  if (typeof value === "string") {
    const num = parseFloat(value);
    return !isNaN(num) ? num.toFixed(2) : null;
  }
  return null;
};

const asRecord = (value: unknown): JsonRecord | null => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as JsonRecord;
};

const buildNormalizedPayment = (document: DiscordPaymentDocument) => {
  if (!document.userId) {
    return null;
  }

  if (document.paymentType === "subscription") {
    const title = asNonEmptyString(document.paymentData.title);
    const startDate = asNonEmptyString(document.paymentData.startDate);
    const period = asPositiveInteger(document.paymentData.periodMonths);
    const amount = asDecimal(document.paymentData.amount) || "0.00";
    const category = asNonEmptyString(document.paymentData.category) || "subscription";

    if (!title || !startDate || !period) {
      return null;
    }

    return {
      description: title,
      amount,
      dueDate: addMonths(toDate(startDate), period),
      status: "pending",
      category,
      period,
      notes: `Discord document ${document.id}. Period: ${period} month(s).`,
    };
  }

  if (document.paymentType === "one-time") {
    const title = asNonEmptyString(document.paymentData.title);
    const dueDate = asNonEmptyString(document.paymentData.dueDate);
    const amount = asDecimal(document.paymentData.amount) || "0.00";
    const category = asNonEmptyString(document.paymentData.category) || "one-time";

    if (!title || !dueDate) {
      return null;
    }

    return {
      description: title,
      amount,
      dueDate: toDate(dueDate),
      status: "pending",
      category,
      notes: `Discord document ${document.id}.`,
    };
  }

  if (document.paymentType === "bill") {
    const title = asNonEmptyString(document.paymentData.title);
    const dueDate = asNonEmptyString(document.paymentData.dueDate);
    const amount = asDecimal(document.paymentData.amount) || "0.00";
    const category = asNonEmptyString(document.paymentData.category) || "bill";
    const receipt = asRecord(document.paymentData.receipt);
    const receiptUrl =
      receipt && typeof receipt.url === "string" ? receipt.url : null;

    if (!title || !dueDate) {
      return null;
    }

    return {
      description: title,
      amount,
      dueDate: toDate(dueDate),
      status: "pending",
      category,
      notes: receiptUrl
        ? `Discord document ${document.id}. Receipt: ${receiptUrl}`
        : `Discord document ${document.id}.`,
    };
  }

  return null;
};

export async function syncNormalizedPaymentForDocument(
  document: DiscordPaymentDocument,
) {
  const normalized = buildNormalizedPayment(document);

  if (!normalized) {
    if (document.paymentId) {
      await db.delete(payment).where(eq(payment.id, document.paymentId));

      const [updatedDocument] = await db
        .update(discordPaymentDocument)
        .set({ paymentId: null })
        .where(eq(discordPaymentDocument.id, document.id))
        .returning();

      return {
        document: updatedDocument,
        payment: null,
      };
    }

    return {
      document,
      payment: null,
    };
  }

  if (document.paymentId) {
    const [updatedPayment] = await db
      .update(payment)
      .set(normalized)
      .where(eq(payment.id, document.paymentId))
      .returning();

    return {
      document,
      payment: updatedPayment,
    };
  }

  const [createdPayment] = await db
    .insert(payment)
    .values({
      id: randomUUID(),
      userId: document.userId!,
      ...normalized,
    })
    .returning();

  const [updatedDocument] = await db
    .update(discordPaymentDocument)
    .set({ paymentId: createdPayment.id })
    .where(eq(discordPaymentDocument.id, document.id))
    .returning();

  return {
    document: updatedDocument,
    payment: createdPayment,
  };
}

export async function createDiscordPaymentRecord(
  input: CreateDiscordPaymentInput,
) {

  const [document] = await db
    .insert(discordPaymentDocument)
    .values({
      id: randomUUID(),
      userId: input.userId,
      accountId: input.accountId,
      discordUserId: input.discordUserId,
      paymentId: null,
      paymentType: input.paymentType.trim(),
      paymentData: input.paymentData,
      guildId: input.guildId ?? null,
      channelId: input.channelId ?? null,
      source: input.source?.trim() ? input.source.trim() : "discord",
    })
    .returning();

  return syncNormalizedPaymentForDocument(document);
}

export async function deleteDiscordPaymentRecord(document: DiscordPaymentDocument) {
  if (document.paymentId) {
    await db.delete(payment).where(eq(payment.id, document.paymentId));
  }

  const [deletedDocument] = await db
    .delete(discordPaymentDocument)
    .where(eq(discordPaymentDocument.id, document.id))
    .returning();

  return deletedDocument;
}

export const getOwnedDocument = async (documentId: string, discordUserId: string) => {
  const [document] = await db
    .select()
    .from(discordPaymentDocument)
    .where(
      and(
        eq(discordPaymentDocument.id, documentId),
        eq(discordPaymentDocument.discordUserId, discordUserId),
      ),
    )
    .limit(1);

  return document ?? null;
};