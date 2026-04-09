CREATE TABLE "discord_payment_document" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"payment_type" text NOT NULL,
	"payment_data" jsonb NOT NULL,
	"discord_user_id" text,
	"guild_id" text,
	"channel_id" text,
	"source" text DEFAULT 'discord' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"category" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "discord_payment_document" ADD CONSTRAINT "discord_payment_document_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "discord_payment_document_user_idx" ON "discord_payment_document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "discord_payment_document_type_idx" ON "discord_payment_document" USING btree ("payment_type");--> statement-breakpoint
CREATE INDEX "discord_payment_document_guild_idx" ON "discord_payment_document" USING btree ("guild_id");--> statement-breakpoint
CREATE INDEX "payment_userId_idx" ON "payment" USING btree ("user_id");