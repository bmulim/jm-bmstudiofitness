CREATE TABLE "tb_coach_observations_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"professor_id" uuid NOT NULL,
	"observation_type" text NOT NULL,
	"observation_text" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tb_user_confirmation_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tb_user_confirmation_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "tb_coach_observations_history" ADD CONSTRAINT "tb_coach_observations_history_user_id_tb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_coach_observations_history" ADD CONSTRAINT "tb_coach_observations_history_professor_id_tb_users_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_user_confirmation_tokens" ADD CONSTRAINT "tb_user_confirmation_tokens_user_id_tb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;