import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { createDiscordPaymentRecord } from "@/lib/db/discord/discordPayments";
import { findDiscordAccountByDiscordUserId } from "@/lib/db/discord/discordUserLinks";
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

const getAttachmentPayload = (
  interaction: ChatInputCommandInteraction,
  optionName: string,
) => {
  const attachment = interaction.options.getAttachment(optionName);

  if (!attachment) {
    return null;
  }

  return {
    name: attachment.name,
    url: attachment.url,
    contentType: attachment.contentType,
    size: attachment.size,
  };
};

const createDiscordPayment = async (
  interaction: ChatInputCommandInteraction,
  paymentType: string,
  paymentData: Record<string, unknown>,
) => {
  const discordAccount = await findDiscordAccountByDiscordUserId(interaction.user.id);

  if (!discordAccount) {
    throw new Error(`Discord user ${interaction.user.id} is not linked to an app user. Please link your Discord account first.`);
  }

  return createDiscordPaymentRecord({
    userId: discordAccount.userId,
    accountId: discordAccount.id,
    discordUserId: interaction.user.id,
    paymentType,
    paymentData,
    guildId: interaction.guildId,
    channelId: interaction.channelId,
    source: "discord",
  });
};

export const AddPaymentCommand: Command = {
  data: addPaymentCommand,
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

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

      try {
        const createdPayment = await createDiscordPayment(
          interaction,
          "subscription",
          {
            title,
            startDate,
            periodMonths: period,
          },
        );

        await interaction.editReply({
          content:
            `Subscription payment saved.\n` +
            `Document ID: ${createdPayment.document.id}\n` +
            `App Payment ID: ${createdPayment.payment?.id ?? "Not linked to an app user yet"}\n` +
            `Title: ${title}\nStart Date: ${startDate}\nPeriod: ${period} month(s)`,
        });
      } catch (error) {
        await interaction.editReply({
          content: `Error: ${error instanceof Error ? error.message : "Failed to create payment"}`,
        });
      }
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

      try {
        const createdPayment = await createDiscordPayment(
          interaction,
          "one-time",
          {
            title,
            dueDate,
          },
        );

        await interaction.editReply({
          content:
            `One-time payment saved.\n` +
            `Document ID: ${createdPayment.document.id}\n` +
            `App Payment ID: ${createdPayment.payment?.id ?? "Not linked to an app user yet"}\n` +
            `Title: ${title}\nDue Date: ${dueDate}`,
        });
      } catch (error) {
        await interaction.editReply({
          content: `Error: ${error instanceof Error ? error.message : "Failed to create payment"}`,
        });
      }
      return;
    }

    if (subcommand === "bill") {
      const title = interaction.options.getString("title", true);
      const dueDate = interaction.options.getString("due_date", true);
      const receipt = getAttachmentPayload(interaction, "receipt");

      if (!isIsoDate(dueDate)) {
        await interaction.editReply({
          content: "Use YYYY-MM-DD for due_date.",
        });
        return;
      }

      try {
        const createdPayment = await createDiscordPayment(
          interaction,
          "bill",
          {
            title,
            dueDate,
            receipt,
          },
        );

        await interaction.editReply({
          content:
            `Bill payment saved.\n` +
            `Document ID: ${createdPayment.document.id}\n` +
            `App Payment ID: ${createdPayment.payment?.id ?? "Not linked to an app user yet"}\n` +
            `Title: ${title}\nDue Date: ${dueDate}\n` +
            `${receipt ? `Receipt: ${receipt.name} (${receipt.url})` : "No file uploaded."}`,
        });
      } catch (error) {
        await interaction.editReply({
          content: `Error: ${error instanceof Error ? error.message : "Failed to create payment"}`,
        });
      }
      return;
    }

    await interaction.editReply({
      content: "Unsupported payment type.",
    });
  },
};
