import { readdir } from "fs/promises";
import path from "path";
import { Command } from "@/types/discordTypes";

const commandsDirectory = path.join(__dirname, "commands");

const isCommand = (value: unknown): value is Command => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Command>;

  return (
    !!candidate.data &&
    typeof candidate.execute === "function" &&
    typeof candidate.data.name === "string"
  );
};

export const loadCommands = async (): Promise<Command[]> => {
  const files = await readdir(commandsDirectory);
  const commandFiles = files.filter(
    (file) =>
      (file.endsWith(".ts") || file.endsWith(".js")) &&
      !file.endsWith(".d.ts"),
  );

  const commands: Command[] = [];

  for (const file of commandFiles) {
    const modulePath = path.join(commandsDirectory, file);
    const moduleExports = await import(modulePath);
    const command = Object.values(moduleExports).find(isCommand);

    if (!command) {
      console.warn(`[WARN] No valid command export found in ${file}`);
      continue;
    }

    commands.push(command);
  }

  return commands;
};
