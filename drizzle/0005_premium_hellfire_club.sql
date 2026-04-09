ALTER TABLE "discord_payment_document"
ALTER COLUMN "user_id"
SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "discord_payment_document"
ALTER COLUMN "discord_user_id"
SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "discord_payment_document"
ADD COLUMN "account_id" text NOT NULL;
--> statement-breakpoint
ALTER TABLE "discord_payment_document"
ADD CONSTRAINT "discord_payment_document_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "discord_payment_document_account_idx" ON "discord_payment_document" USING btree ("account_id");
--> statement-breakpoint
CREATE INDEX "discord_payment_document_discord_user_idx" ON "discord_payment_document" USING btree ("discord_user_id");