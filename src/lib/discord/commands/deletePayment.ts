import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { deleteDiscordPaymentRecord } from "@/lib/db/discord/discordPayments";
import { findDiscordAccountByDiscordUserId } from "@/lib/db/discord/discordUserLinks";
import { discordPaymentDocument } from "@/lib/db/schema";
import { Command } from "@/types/discordTypes";

const deletePaymentCommand = new SlashCommandBuilder()
  .setName("delete-payment")
  .setDescription("Delete one of your payment reminders")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("document")
      .setDescription("Delete a payment by document ID")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Payment document ID")
          .setRequired(true),
      ),
  );

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

export const DeletePaymentCommand: Command = {
  data: deletePaymentCommand,
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand !== "document") {
        await interaction.editReply({
          content: "Unsupported delete target.",
        });
        return;
      }

      const discordAccount = await findDiscordAccountByDiscordUserId(
        interaction.user.id,
      );

      if (!discordAccount) {
        await interaction.editReply({
          content:
            "You're not linked to an app user. Please link your Discord account first.",
        });
        return;
      }

      const documentId = interaction.options.getString("id", true);
      const document = await getOwnedDocument(documentId, interaction.user.id);

      if (!document) {
        await interaction.editReply({
          content: "Payment document not found.",
        });
        return;
      }

      const deletedDocument = await deleteDiscordPaymentRecord(document);

      await interaction.editReply({
        content:
          `Payment deleted.\n` +
          `Document ID: ${deletedDocument.id}\n` +
          `Type: ${deletedDocument.paymentType}\n` +
          `Title: ${String(deletedDocument.paymentData.title ?? "Unknown")}`,
      });
    } catch (error) {
      console.error("[DELETE_PAYMENT] Error:", error);

      await interaction.editReply({
        content: `Error: ${error instanceof Error ? error.message : "Failed to delete payment"}`,
      });
    }
  },
};
