import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { Command } from "@/types/discordTypes";

const addPaymentCommand = new SlashCommandBuilder()
  .setName("add-payment")
  .setDescription("Add a payment reminder")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("subscription")
      .setDescription("Add a subscription payment")
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Subscription title")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("start_date")
          .setDescription("Start date in YYYY-MM-DD format")
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName("period")
          .setDescription("Billing period in months")
          .setMinValue(1)
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("one-time")
      .setDescription("Add a one-time payment")
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Payment title")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("due_date")
          .setDescription("Due date in YYYY-MM-DD format")
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("bill")
      .setDescription("Add a bill, for example, water bill or electricity bill")
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Payment title")
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName("due_date")
          .setDescription("Due date in YYYY-MM-DD format")
          .setRequired(true),
      )
      .addAttachmentOption((option) =>
        option
          .setName("receipt")
          .setDescription("Upload a bill, invoice, or receipt")
          .setRequired(false),
      ),
  );

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const formatAttachment = (
  interaction: ChatInputCommandInteraction,
  optionName: string,
) => {
  const attachment = interaction.options.getAttachment(optionName);

  if (!attachment) {
    return "No file uploaded.";
  }

  return `Uploaded File: ${attachment.name} (${attachment.url})`;
};

export const AddPaymentCommand: Command = {
  data: addPaymentCommand,
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    if (process.env.NODE_ENV === 'development') {
      console.log("[ADD_PAYMENT] command:", interaction.commandName);
      console.log("[ADD_PAYMENT] subcommand:", subcommand);
    }

    if (subcommand === "subscription") {
      const title = interaction.options.getString("title", true);
      const startDate = interaction.options.getString("start_date", true);
      const period = interaction.options.getInteger("period", true);

      if (!isIsoDate(startDate)) {
        await interaction.editReply({
          content: "Use YYYY-MM-DD for start_date.",
        });
        return;
      }

      await interaction.editReply({
        content:
          `Subscription payment captured.\n` +
          `Title: ${title}\nStart Date: ${startDate}\nPeriod: ${period} month(s)`,
      });
      return;
    }

    if (subcommand === "one-time") {
      const title = interaction.options.getString("title", true);
      const dueDate = interaction.options.getString("due_date", true);

      if (!isIsoDate(dueDate)) {
        await interaction.editReply({
          content: "Use YYYY-MM-DD for due_date.",
        });
        return;
      }

      await interaction.editReply({
        content:
          `One-time payment captured.\n` +
          `Title: ${title}\nDue Date: ${dueDate}`,
      });
      return;
    }

    if (subcommand === "bill") {
      const title = interaction.options.getString("title", true);
      const dueDate = interaction.options.getString("due_date", true);
      const receiptLine = formatAttachment(interaction, "receipt");

      if (!isIsoDate(dueDate)) {
        await interaction.editReply({
          content: "Use YYYY-MM-DD for due_date.",
        });
        return;
      }

      await interaction.editReply({
        content:
          `Bill payment captured.\n` +
          `Title: ${title}\nDue Date: ${dueDate}\n${receiptLine}`,
      });
      return;
    }

    await interaction.editReply({
      content: "Unsupported payment type.",
    });
  },
};
