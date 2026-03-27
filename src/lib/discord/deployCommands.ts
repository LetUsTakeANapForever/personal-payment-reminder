import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { PingCommand } from "./commands/ping";
import { Command } from "@/types/discordTypes";
dotenv.config();

const commands: Command[] = [PingCommand];
const commandPayload = commands.map((command) => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!);

async function deployCommands() {
  try {
    console.log("Registering slash commands...");

    const applicationId = process.env.DISCORD_APPLICATION_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!applicationId) {
      throw new Error("DISCORD_APPLICATION_ID is required.");
    }

    await rest.put(
      guildId
        ? Routes.applicationGuildCommands(applicationId, guildId)
        : Routes.applicationCommands(applicationId),
      {
        body: commandPayload,
      }
    );

    console.log(
      guildId
        ? `Commands registered successfully for guild ${guildId}`
        : "Commands registered successfully globally"
    );
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
