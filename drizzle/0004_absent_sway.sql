CREATE TABLE "discord_user_link" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"discord_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "discord_user_link_discord_user_id_unique" UNIQUE("discord_user_id")
);
--> statement-breakpoint
ALTER TABLE "discord_user_link" ADD CONSTRAINT "discord_user_link_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "discord_user_link_user_idx" ON "discord_user_link" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "discord_user_link_discord_idx" ON "discord_user_link" USING btree ("discord_user_id");