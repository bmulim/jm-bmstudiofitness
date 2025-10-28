CREATE TABLE "tb_check_ins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"check_in_date" date DEFAULT now() NOT NULL,
	"check_in_time" text NOT NULL,
	"method" text NOT NULL,
	"identifier" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tb_financial" ADD COLUMN "payment_method" text DEFAULT 'dinheiro' NOT NULL;--> statement-breakpoint
ALTER TABLE "tb_financial" ADD COLUMN "last_payment_date" date;--> statement-breakpoint
ALTER TABLE "tb_health_metrics" ADD COLUMN "coach_observations_particular" text;--> statement-breakpoint
ALTER TABLE "tb_personal_data" ADD COLUMN "email" text DEFAULT 'temp@example.com' NOT NULL;--> statement-breakpoint
ALTER TABLE "tb_users" ADD COLUMN "user_role" text DEFAULT 'aluno' NOT NULL;--> statement-breakpoint
ALTER TABLE "tb_check_ins" ADD CONSTRAINT "tb_check_ins_user_id_tb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tb_personal_data" ADD CONSTRAINT "tb_personal_data_email_unique" UNIQUE("email");