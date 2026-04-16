import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export type AddDiscordPaymentInput = {
  paymentType: string;
  paymentData: Record<string, unknown>;
  userId?: string | null;
  discordUserId?: string | null;
  guildId?: string | null;
  channelId?: string | null;
  source?: string | null;
};

export type PaymentData = {
  description: string;
  amount: string;
  dueDate: Date;
  category: string | null;
  status: string;
  notes: string | null;
};