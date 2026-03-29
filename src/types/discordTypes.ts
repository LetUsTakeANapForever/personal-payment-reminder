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