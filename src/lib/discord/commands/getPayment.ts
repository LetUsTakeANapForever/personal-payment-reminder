import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { db } from "@/lib/db";
import { discordPaymentDocument, payment } from "@/lib/db/schema";
import { eq, desc, inArray, type InferSelectModel } from "drizzle-orm";
import { ensureDiscordAccount } from "@/lib/discord/actions/discordUserLinks";
import { Command, PaymentData } from "@/types/discordTypes";

type DiscordPaymentDoc = InferSelectModel<typeof discordPaymentDocument>;
type AppPayment = InferSelectModel<typeof payment>;
type ReceiptData = {
  name?: string;
  url?: string;
  contentType?: string;
};

const getPaymentCommand = new SlashCommandBuilder()
  .setName("get-payment")
  .setDescription("View your payment reminders")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("list")
      .setDescription("List all your payment reminders"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("details")
      .setDescription("Get details of a specific payment")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Payment document ID")
          .setRequired(true),
      ),
  );

// Coerces JSON-backed values into strings for embed-friendly display fields.
const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asAmountString = (value: unknown, fallback = "0.00") => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toFixed(2);
  }

  return fallback;
};

const getFallbackPaymentData = (doc: DiscordPaymentDoc): PaymentData => ({
  description: asString(doc.paymentData.title, "Unknown"),
  amount: asAmountString(doc.paymentData.amount),
  dueDate: new Date(),
  category: asString(doc.paymentData.category, "Unknown"),
  status: asString(doc.paymentData.status, "pending"),
  notes: asString(doc.paymentData.notes),
});

const toPaymentData = (
  doc: DiscordPaymentDoc,
  appPayment?: AppPayment,
): PaymentData => {
  if (!appPayment) {
    return getFallbackPaymentData(doc);
  }

  return {
    description: appPayment.description,
    amount: String(appPayment.amount),
    dueDate: appPayment.dueDate,
    category: appPayment.category,
    status: appPayment.status,
    notes: appPayment.notes,
  };
};

const getReceiptData = (doc: DiscordPaymentDoc): ReceiptData | null => {
  const receipt = doc.paymentData.receipt;

  if (!receipt || typeof receipt !== "object" || Array.isArray(receipt)) {
    return null;
  }

  return receipt as ReceiptData;
};

const isImageUrl = (value: string) =>
  /\.(png|jpe?g|gif|webp|bmp)$/i.test(value);

const getReceiptUrl = (
  doc: DiscordPaymentDoc,
  appPayment?: AppPayment,
) => {
  if (typeof appPayment?.receipt === "string" && appPayment.receipt.trim()) {
    return appPayment.receipt.trim();
  }

  const receipt = getReceiptData(doc);
  if (typeof receipt?.url === "string" && receipt.url.trim()) {
    return receipt.url.trim();
  }

  return null;
};

const getReceiptImageUrl = (
  doc: DiscordPaymentDoc,
  appPayment?: AppPayment,
) => {
  const receiptUrl = getReceiptUrl(doc, appPayment);

  if (!receiptUrl) {
    return null;
  }

  const receipt = getReceiptData(doc);

  if (typeof receipt?.contentType === "string") {
    return receipt.contentType.startsWith("image/") ? receiptUrl : null;
  }

  return isImageUrl(receiptUrl) ? receiptUrl : null;
};

const getNotesForDisplay = (
  doc: DiscordPaymentDoc,
  paymentData: PaymentData,
  appPayment?: AppPayment,
) => {
  const receiptUrl = getReceiptUrl(doc, appPayment);
  const receiptImageUrl = getReceiptImageUrl(doc, appPayment);

  if (!receiptUrl) {
    return paymentData.notes;
  }

  if (!paymentData.notes) {
    return receiptImageUrl ? "Receipt attached below." : `Receipt: ${receiptUrl}`;
  }

  if (receiptImageUrl) {
    return `${paymentData.notes}\nReceipt attached below.`;
  }

  return `${paymentData.notes}\nReceipt: ${receiptUrl}`;
};

const formatPaymentEmbed = (
  doc: DiscordPaymentDoc,
  paymentData: PaymentData,
  appPayment?: AppPayment,
) => {
  const notesForDisplay = getNotesForDisplay(doc, paymentData, appPayment);
  const receiptImageUrl = getReceiptImageUrl(doc, appPayment);

  const embed = new EmbedBuilder()
    .setTitle(`Payment: ${paymentData.description}`)
    .setColor("#3498db")
    .addFields(
      { name: "Document ID", value: doc.id, inline: true },
      { name: "Type", value: doc.paymentType, inline: true },
      { name: "Category", value: paymentData.category || "N/A", inline: true },
      { name: "Amount", value: `$${paymentData.amount}`, inline: true },
      {
        name: "Due Date",
        value: paymentData.dueDate
          ? new Date(paymentData.dueDate).toLocaleDateString()
          : "N/A",
        inline: true,
      },
      { name: "Status", value: paymentData.status || "pending", inline: true },
    );

  if (doc.paymentId) {
    embed.addFields({
      name: "App Payment ID",
      value: doc.paymentId,
      inline: false,
    });
  }

  if (notesForDisplay) {
    embed.addFields({
      name: "Notes",
      value: notesForDisplay,
      inline: false,
    });
  }

  if (receiptImageUrl) {
    embed.setImage(receiptImageUrl);
  }

  embed.setFooter({
    text: `Created: ${new Date(doc.createdAt).toLocaleDateString()} | Updated: ${new Date(doc.updatedAt).toLocaleDateString()}`,
  });

  return embed;
};

export const GetPaymentCommand: Command = {
  data: getPaymentCommand,
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    try {
      await ensureDiscordAccount(interaction.user.id);

      if (subcommand === "list") {
        const documents: DiscordPaymentDoc[] = await db
          .select()
          .from(discordPaymentDocument)
          .where(eq(discordPaymentDocument.discordUserId, interaction.user.id))
          .orderBy(desc(discordPaymentDocument.createdAt));

        if (documents.length === 0) {
          await interaction.editReply({
            content: "You don't have any payment reminders yet.",
          });
          return;
        }

        const paymentIds = documents
          .filter((doc) => doc.paymentId)
          .map((doc) => doc.paymentId);

        const payments = paymentIds.length > 0
          ? await db
              .select()
              .from(payment)
              .where(inArray(payment.id, paymentIds as string[]))
          : [];

        const paymentMap = new Map(payments.map((p) => [p.id, p]));

        const embeds = documents.slice(0, 10).map((doc) => {
          const appPayment = doc.paymentId
            ? paymentMap.get(doc.paymentId)
            : undefined;
          const paymentData = toPaymentData(doc, appPayment);

          return formatPaymentEmbed(doc, paymentData, appPayment);
        });

        await interaction.editReply({
          embeds,
        });
        return;
      }

      if (subcommand === "details") {
        const docId = interaction.options.getString("id", true);

        const [doc] = (await db
          .select()
          .from(discordPaymentDocument)
          .where(eq(discordPaymentDocument.id, docId))) as DiscordPaymentDoc[];

        if (!doc) {
          await interaction.editReply({
            content: "Payment document not found.",
          });
          return;
        }

        if (doc.discordUserId !== interaction.user.id) {
          await interaction.editReply({
            content: "You don't have permission to view this payment.",
          });
          return;
        }

        let appPayment: AppPayment | undefined;
        let paymentData: PaymentData = toPaymentData(doc);

        if (doc.paymentId) {
          const [selectedPayment] = await db
            .select()
            .from(payment)
            .where(eq(payment.id, doc.paymentId));

          if (selectedPayment) {
            appPayment = selectedPayment;
            paymentData = toPaymentData(doc, selectedPayment);
          }
        }

        const embed = formatPaymentEmbed(doc, paymentData, appPayment);

        await interaction.editReply({
          embeds: [embed],
        });
        return;
      }

      await interaction.editReply({
        content: "Unknown subcommand.",
      });
    } catch (error) {
      console.error("[GET_PAYMENT] Error:", error);

      await interaction.editReply({
        content: `Error: ${error instanceof Error ? error.message : "Failed to fetch payments"}`,
      });
    }
  },
};
