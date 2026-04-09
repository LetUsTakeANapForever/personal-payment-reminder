import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { discordPaymentDocument, account } from "@/lib/db/schema";
import {
  createDiscordPaymentRecord,
  deleteDiscordPaymentRecord,
  syncNormalizedPaymentForDocument,
} from "@/lib/db/discord/discordPayments";

type AddPaymentRequest = {
  paymentType?: unknown;
  paymentData?: unknown;
  userId?: unknown;
  accountId?: unknown;
  guildId?: unknown;
  channelId?: unknown;
  source?: unknown;
};

type UpdatePaymentRequest = {
  id?: unknown;
  paymentType?: unknown;
  paymentData?: unknown;
  accountId?: unknown;
  guildId?: unknown;
  channelId?: unknown;
  source?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getSessionUser = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
};

// POST api/discord-integration/addPayment - Add a payment data
export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as AddPaymentRequest;
    const {
      paymentType,
      paymentData,
      userId,
      accountId,
      guildId,
      channelId,
      source,
    } = body;

    if (
      typeof userId === "string" &&
      userId.trim().length > 0 &&
      userId !== user.id
    ) {
      return NextResponse.json(
        { error: "You can only add payments for your own account." },
        { status: 403 },
      );
    }

    if (typeof paymentType !== "string" || paymentType.trim().length === 0) {
      return NextResponse.json(
        { error: "paymentType is required." },
        { status: 400 },
      );
    }

    if (!isRecord(paymentData)) {
      return NextResponse.json(
        { error: "paymentData must be a JSON object." },
        { status: 400 },
      );
    }

    if (typeof accountId !== "string" || accountId.trim().length === 0) {
      return NextResponse.json(
        { error: "accountId is required." },
        { status: 400 },
      );
    }

    const discordAccount = await db
      .select()
      .from(account)
      .where(and(
        eq(account.id, accountId.trim()),
        eq(account.userId, user.id),
      ))
      .limit(1);

    if (discordAccount.length === 0) {
      return NextResponse.json(
        { error: "Discord account not found or doesn't belong to you." },
        { status: 404 },
      );
    }

    const createdPayment = await createDiscordPaymentRecord({
      userId: user.id,
      accountId: accountId.trim(),
      discordUserId: discordAccount[0].discordUserId,
      paymentType: paymentType.trim(),
      paymentData,
      guildId: typeof guildId === "string" ? guildId : null,
      channelId: typeof channelId === "string" ? channelId : null,
      source: typeof source === "string" && source.trim() ? source : "discord",
    });

    return NextResponse.json(
      {
        message: "Payment document created successfully.",
        document: createdPayment.document,
        payment: createdPayment.payment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[ADD_PAYMENT_API] Failed to create payment document:", error);

    return NextResponse.json(
      { error: "Failed to create payment document." },
      { status: 500 },
    );
  }
}

// GET api/discord-integration/addPayment - get all payments for each user
export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const payments = await db
      .select()
      .from(discordPaymentDocument)
      .where(eq(discordPaymentDocument.userId, user.id))
      .orderBy(desc(discordPaymentDocument.createdAt));

    return NextResponse.json(
      {
        payments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADD_PAYMENT_API] Failed to fetch payment documents:", error);

    return NextResponse.json(
      { error: "Failed to fetch payment documents." },
      { status: 500 },
    );
  }
}

// PATCH api/discord-integration/addPayment - Add a payment data
export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = (await request.json()) as UpdatePaymentRequest;
    const { id, paymentType, paymentData, accountId, guildId, channelId, source } =
      body;

    if (typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        { error: "id is required." },
        { status: 400 },
      );
    }

    const updateValues: Partial<typeof discordPaymentDocument.$inferInsert> = {};

    if (paymentType !== undefined) {
      if (typeof paymentType !== "string" || paymentType.trim().length === 0) {
        return NextResponse.json(
          { error: "paymentType must be a non-empty string." },
          { status: 400 },
        );
      }

      updateValues.paymentType = paymentType.trim();
    }

    if (paymentData !== undefined) {
      if (!isRecord(paymentData)) {
        return NextResponse.json(
          { error: "paymentData must be a JSON object." },
          { status: 400 },
        );
      }

      updateValues.paymentData = paymentData;
    }

    if (discordPaymentDocument.userId !== undefined) {
      if (typeof accountId !== "string" || accountId.trim().length === 0) {
        return NextResponse.json(
          { error: "accountId must be a non-empty string." },
          { status: 400 },
        );
      }

      const discordAccount = await db
        .select()
        .from(account)
        .where(and(
          eq(account.id, accountId.trim()),
          eq(account.userId, user.id),
        ))
        .limit(1);

      if (discordAccount.length === 0) {
        return NextResponse.json(
          { error: "Discord account not found or doesn't belong to you." },
          { status: 404 },
        );
      }

      updateValues.accountId = accountId.trim();
      updateValues.discordUserId = discordAccount[0].discordUserId;
    }

    if (guildId !== undefined) {
      updateValues.guildId = typeof guildId === "string" ? guildId : null;
    }

    if (channelId !== undefined) {
      updateValues.channelId =
        typeof channelId === "string" ? channelId : null;
    }

    if (source !== undefined) {
      updateValues.source =
        typeof source === "string" && source.trim() ? source.trim() : "discord";
    }

    if (Object.keys(updateValues).length === 0) {
      return NextResponse.json(
        { error: "Provide at least one field to update." },
        { status: 400 },
      );
    }

    const [updatedDocument] = await db
      .update(discordPaymentDocument)
      .set(updateValues)
      .where(
        and(
          eq(discordPaymentDocument.id, id.trim()),
          eq(discordPaymentDocument.userId, user.id),
        ),
      )
      .returning();

    if (!updatedDocument) {
      return NextResponse.json(
        { error: "Payment document not found." },
        { status: 404 },
      );
    }

    const synced = await syncNormalizedPaymentForDocument(updatedDocument);

    return NextResponse.json(
      {
        message: "Payment document updated successfully.",
        document: synced.document,
        payment: synced.payment,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADD_PAYMENT_API] Failed to update payment document:", error);

    return NextResponse.json(
      { error: "Failed to update payment document." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required." },
        { status: 400 },
      );
    }

    const [document] = await db
      .select()
      .from(discordPaymentDocument)
      .where(
        and(
          eq(discordPaymentDocument.id, id),
          eq(discordPaymentDocument.userId, user.id),
        ),
      );

    if (!document) {
      return NextResponse.json(
        { error: "Payment document not found." },
        { status: 404 },
      );
    }

    const deletedDocument = await deleteDiscordPaymentRecord(document);

    return NextResponse.json(
      {
        message: "Payment document deleted successfully.",
        document: deletedDocument,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[ADD_PAYMENT_API] Failed to delete payment document:", error);

    return NextResponse.json(
      { error: "Failed to delete payment document." },
      { status: 500 },
    );
  }
}
