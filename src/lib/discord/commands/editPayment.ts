import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import { db } from "@/lib/db";
import { syncNormalizedPaymentForDocument } from "@/lib/db/discord/discordPayments";
import { findDiscordAccountByDiscordUserId } from "@/lib/db/discord/discordUserLinks";
import { discordPaymentDocument, payment } from "@/lib/db/schema";
import { Command, type PaymentData } from "@/types/discordTypes";

type AppPayment = InferSelectModel<typeof payment>;

const editPaymentCommand = new SlashCommandBuilder()
  .setName("edit-payment")
  .setDescription("Edit one of your payment reminders")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("subscription")
      .setDescription("Edit a subscription payment")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Payment document ID")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Subscription title")
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("start_date")
          .setDescription("Start date in YYYY-MM-DD format")
          .setRequired(false),
      )
      .addIntegerOption((option) =>
        option
          .setName("period")
          .setDescription("Billing period in months")
          .setMinValue(1)
          .setRequired(false),
      )
      .addNumberOption((option) =>
        option
          .setName("amount")
          .setDescription("Payment amount")
          .setMinValue(0)
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("category")
          .setDescription("Payment category")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("one-time")
      .setDescription("Edit a one-time payment")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Payment document ID")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Payment title")
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("due_date")
          .setDescription("Due date in YYYY-MM-DD format")
          .setRequired(false),
      )
      .addNumberOption((option) =>
        option
          .setName("amount")
          .setDescription("Payment amount")
          .setMinValue(0)
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("category")
          .setDescription("Payment category")
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("bill")
      .setDescription("Edit a bill payment")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Payment document ID")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Payment title")
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("due_date")
          .setDescription("Due date in YYYY-MM-DD format")
          .setRequired(false),
      )
      .addNumberOption((option) =>
        option
          .setName("amount")
          .setDescription("Payment amount")
          .setMinValue(0)
          .setRequired(false),
      )
      .addStringOption((option) =>
        option
          .setName("category")
          .setDescription("Payment category")
          .setRequired(false),
      )
      .addAttachmentOption((option) =>
        option
          .setName("receipt")
          .setDescription("Upload a replacement bill, invoice, or receipt")
          .setRequired(false),
      ),
  );

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const getAttachmentPayload = (
  interaction: ChatInputCommandInteraction,
  optionName: string,
) => {
  const attachment = interaction.options.getAttachment(optionName);

  if (!attachment) {
    return undefined;
  }

  return {
    name: attachment.name,
    url: attachment.url,
    contentType: attachment.contentType,
    size: attachment.size,
  };
};

const getOwnedDocument = async (documentId: string, discordUserId: string) => {
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

const ensureDiscordAccount = async (discordUserId: string) => {
  const discordAccount = await findDiscordAccountByDiscordUserId(discordUserId);

  if (!discordAccount) {
    throw new Error(
      `Discord user ${discordUserId} is not linked to an app user. Please link your Discord account first.`,
    );
  }

  return discordAccount;
};

const getAppPaymentById = async (paymentId: string | null) => {
  if (!paymentId) {
    return null;
  }

  const [appPayment] = await db
    .select()
    .from(payment)
    .where(eq(payment.id, paymentId))
    .limit(1);

  return appPayment ?? null;
};

const updateDiscordPayment = async (
  interaction: ChatInputCommandInteraction,
  expectedPaymentType: "subscription" | "one-time" | "bill",
  paymentDataPatch: Record<string, unknown>,
) => {
  await ensureDiscordAccount(interaction.user.id);

  const documentId = interaction.options.getString("id", true);
  const document = await getOwnedDocument(documentId, interaction.user.id);

  if (!document) {
    throw new Error("Payment document not found.");
  }

  if (document.paymentType !== expectedPaymentType) {
    throw new Error(
      `Payment ${documentId} is a ${document.paymentType} payment, not ${expectedPaymentType}.`,
    );
  }

  if (Object.keys(paymentDataPatch).length === 0) {
    throw new Error("Provide at least one field to update.");
  }

  const originalPayment = await getAppPaymentById(document.paymentId);

  const [updatedDocument] = await db
    .update(discordPaymentDocument)
    .set({
      paymentData: {
        ...document.paymentData,
        ...paymentDataPatch,
      },
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      source: "discord",
    })
    .where(eq(discordPaymentDocument.id, document.id))
    .returning();

  const synced = await syncNormalizedPaymentForDocument(updatedDocument);

  return {
    originalDocument: document,
    originalPayment,
    ...synced,
  };
};

const getDisplayValue = (
  updatedValue: unknown,
  originalValue: unknown,
  fallback: string,
) => {
  if (updatedValue !== undefined && updatedValue !== null) {
    return String(updatedValue);
  }

  if (originalValue !== undefined && originalValue !== null) {
    return String(originalValue);
  }

  return fallback;
};

const getPaymentSummary = (
  updatedPayment: AppPayment | null,
  originalPayment: AppPayment | null,
): PaymentData => ({
  description:
    updatedPayment?.description ??
    originalPayment?.description ??
    "Unknown",
  amount: String(updatedPayment?.amount ?? originalPayment?.amount ?? "0.00"),
  dueDate: updatedPayment?.dueDate ?? originalPayment?.dueDate ?? new Date(),
  category: updatedPayment?.category ?? originalPayment?.category ?? "Unknown",
  status: updatedPayment?.status ?? originalPayment?.status ?? "pending",
  notes: updatedPayment?.notes ?? originalPayment?.notes ?? null,
});

export const EditPaymentCommand: Command = {
  data: editPaymentCommand,
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === "subscription") {
        const title = interaction.options.getString("title");
        const startDate = interaction.options.getString("start_date");
        const period = interaction.options.getInteger("period");
        const amount = interaction.options.getNumber("amount");
        const category = interaction.options.getString("category");

        if (startDate && !isIsoDate(startDate)) {
          await interaction.editReply({
            content: "Use YYYY-MM-DD for start_date.",
          });
          return;
        }

        const updatedPayment = await updateDiscordPayment(
          interaction,
          "subscription",
          {
            ...(title !== null ? { title } : {}),
            ...(startDate !== null ? { startDate } : {}),
            ...(period !== null ? { periodMonths: period } : {}),
            ...(amount !== null ? { amount: amount.toFixed(2) } : {}),
            ...(category !== null ? { category } : {}),
          },
        );
        const paymentSummary = getPaymentSummary(
          updatedPayment.payment,
          updatedPayment.originalPayment,
        );

        await interaction.editReply({
          content:
            `Subscription payment updated.\n` +
            `Document ID: ${updatedPayment.document.id}\n` +
            `App Payment ID: ${updatedPayment.payment?.id ?? "No normalized payment"}\n` +
            `Title: ${getDisplayValue(updatedPayment.document.paymentData.title, updatedPayment.originalDocument.paymentData.title, "Unknown")}\n` +
            `Start Date: ${getDisplayValue(updatedPayment.document.paymentData.startDate, updatedPayment.originalDocument.paymentData.startDate, "N/A")}\n` +
            `Period: ${getDisplayValue(updatedPayment.document.paymentData.periodMonths, updatedPayment.originalDocument.paymentData.periodMonths, "N/A")} month(s)\n` +
            `Amount: $${paymentSummary.amount}\n` +
            `Category: ${paymentSummary.category ?? "Unknown"}`,
        });
        return;
      }

      if (subcommand === "one-time") {
        const title = interaction.options.getString("title");
        const dueDate = interaction.options.getString("due_date");
        const amount = interaction.options.getNumber("amount");
        const category = interaction.options.getString("category");

        if (dueDate && !isIsoDate(dueDate)) {
          await interaction.editReply({
            content: "Use YYYY-MM-DD for due_date.",
          });
          return;
        }

        const updatedPayment = await updateDiscordPayment(
          interaction,
          "one-time",
          {
            ...(title !== null ? { title } : {}),
            ...(dueDate !== null ? { dueDate } : {}),
            ...(amount !== null ? { amount: amount.toFixed(2) } : {}),
            ...(category !== null ? { category } : {}),
          },
        );
        const paymentSummary = getPaymentSummary(
          updatedPayment.payment,
          updatedPayment.originalPayment,
        );

        await interaction.editReply({
          content:
            `One-time payment updated.\n` +
            `Document ID: ${updatedPayment.document.id}\n` +
            `App Payment ID: ${updatedPayment.payment?.id ?? "No normalized payment"}\n` +
            `Title: ${getDisplayValue(updatedPayment.document.paymentData.title, updatedPayment.originalDocument.paymentData.title, "Unknown")}\n` +
            `Due Date: ${getDisplayValue(updatedPayment.document.paymentData.dueDate, updatedPayment.originalDocument.paymentData.dueDate, "N/A")}\n` +
            `Amount: $${paymentSummary.amount}\n` +
            `Category: ${paymentSummary.category ?? "Unknown"}`,
        });
        return;
      }

      if (subcommand === "bill") {
        const title = interaction.options.getString("title");
        const dueDate = interaction.options.getString("due_date");
        const amount = interaction.options.getNumber("amount");
        const category = interaction.options.getString("category");
        const receipt = getAttachmentPayload(interaction, "receipt");

        if (dueDate && !isIsoDate(dueDate)) {
          await interaction.editReply({
            content: "Use YYYY-MM-DD for due_date.",
          });
          return;
        }

        const updatedPayment = await updateDiscordPayment(
          interaction,
          "bill",
          {
            ...(title !== null ? { title } : {}),
            ...(dueDate !== null ? { dueDate } : {}),
            ...(amount !== null ? { amount: amount.toFixed(2) } : {}),
            ...(category !== null ? { category } : {}),
            ...(receipt !== undefined ? { receipt } : {}),
          },
        );
        const paymentSummary = getPaymentSummary(
          updatedPayment.payment,
          updatedPayment.originalPayment,
        );

        await interaction.editReply({
          content:
            `Bill payment updated.\n` +
            `Document ID: ${updatedPayment.document.id}\n` +
            `App Payment ID: ${updatedPayment.payment?.id ?? "No normalized payment"}\n` +
            `Title: ${getDisplayValue(updatedPayment.document.paymentData.title, updatedPayment.originalDocument.paymentData.title, "Unknown")}\n` +
            `Due Date: ${getDisplayValue(updatedPayment.document.paymentData.dueDate, updatedPayment.originalDocument.paymentData.dueDate, "N/A")}\n` +
            `Amount: $${paymentSummary.amount}\n` +
            `Category: ${paymentSummary.category ?? "Unknown"}\n` +
            `${
              updatedPayment.document.paymentData.receipt
                ? "Receipt: updated"
                : "Receipt: unchanged or not set"
            }`,
        });
        return;
      }

      await interaction.editReply({
        content: "Unsupported payment type.",
      });
    } catch (error) {
      console.error("[EDIT_PAYMENT] Error:", error);

      await interaction.editReply({
        content: `Error: ${error instanceof Error ? error.message : "Failed to update payment"}`,
      });
    }
  },
};
