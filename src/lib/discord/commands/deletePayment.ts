import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { deleteDiscordPaymentRecord, getOwnedDocument } from "@/lib/discord/actions/discordPayments";
import { ensureDiscordAccount } from "@/lib/discord/actions/discordUserLinks";
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

      await ensureDiscordAccount(interaction.user.id);

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
