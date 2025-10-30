CREATE TABLE "tb_student_health_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"height_cm" integer,
	"weight_kg" text,
	"notes" text,
	"updated_at" date DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tb_check_ins" ALTER COLUMN "check_in_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tb_check_ins" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "tb_check_ins" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tb_check_ins" ADD COLUMN "check_in_timestamp" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tb_student_health_history" ADD CONSTRAINT "tb_student_health_history_user_id_tb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;