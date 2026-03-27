import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { PingCommand } from "./commands/ping";
import { Command, ExtendedClient } from "@/types/discordTypes";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
  ],
}) as ExtendedClient;

client.commands = new Collection();

const commands: Command[] = [PingCommand];

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

const buildInviteUrl = () => {
  const applicationId = process.env.DISCORD_APPLICATION_ID;

  if (!applicationId) {
    return null;
  }

  return `https://discord.com/api/oauth2/authorize?client_id=${applicationId}&permissions=0&scope=bot%20applications.commands`;
};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);

  const guildId = process.env.DISCORD_GUILD_ID;

  if (!guildId) {
    console.warn(
      "[WARN] DISCORD_GUILD_ID is not set. The bot will work in any server it has been invited to."
    );
    return;
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    console.log(`[INFO] Connected to guild: ${guild.name} (${guild.id})`);
  } catch (error) {
    console.error(
      `[ERROR] Bot is not a member of guild ${guildId}. Invite it before starting command handling.`
    );

    const inviteUrl = buildInviteUrl();

    if (inviteUrl) {
      console.log(`[INFO] Invite URL: ${inviteUrl}`);
    }

    console.error(error);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`[WARN] Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    const start = Date.now();

    await command.execute(interaction);

    console.log(
      `[INFO] ${interaction.commandName} executed in ${
        Date.now() - start
      }ms`
    );
  } catch (error) {
    console.error(`[ERROR] Command execution failed:`, error);

    const errorMessage = {
      content: "Something went wrong while executing this command.",
      ephemeral: true,
    };

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (err) {
      console.error("[ERROR] Failed to send error response:", err);
    }
  }
});

export const startDiscordBot = async () => {
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!token) {
    throw new Error("DISCORD_BOT_TOKEN is required to start the Discord bot.");
  }

  try {
    await client.login(token);
  } catch (error) {
    console.error("Discord login failed:", error);
  }
};

export default client;
