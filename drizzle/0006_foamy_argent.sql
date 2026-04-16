ALTER TABLE "account" RENAME COLUMN "account_id" TO "discord_user_id";--> statement-breakpoint
ALTER TABLE "payment" ADD COLUMN "period" integer;