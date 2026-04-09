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
