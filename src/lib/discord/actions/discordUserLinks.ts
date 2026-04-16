import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { account } from "@/lib/db/schema";

export async function findDiscordAccountByDiscordUserId(discordUserId: string) {
  const [discordAccount] = await db
    .select()
    .from(account)
    .where(eq(account.discordUserId, discordUserId))
    .limit(1);

  return discordAccount ?? null;
}

export const ensureDiscordAccount = async (discordUserId: string) => {
  const discordAccount = await findDiscordAccountByDiscordUserId(discordUserId);

  if (!discordAccount) {
    throw new Error(
      `Discord user ${discordUserId} is not linked to an app user. Please link your Discord account first.`,
    );
  }

  return discordAccount;
};
