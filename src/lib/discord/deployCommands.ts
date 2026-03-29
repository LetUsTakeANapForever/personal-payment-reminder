import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { loadCommands } from "./loadCommands";

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  throw new Error("DISCORD_BOT_TOKEN is required.");
}

const rest = new REST({ version: "10" }).setToken(token);

async function deployCommands() {
  try {
    console.log("Registering slash commands...");

    const commands = await loadCommands();
    const commandPayload = commands.map((command) => command.data.toJSON());

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
      },
    );

    console.log(
      guildId
        ? `Commands registered successfully for guild ${guildId}`
        : "Commands registered successfully globally",
    );
  } catch (error) {
    console.error(error);
  }
}

void deployCommands();
