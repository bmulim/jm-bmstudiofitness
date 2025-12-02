CREATE TABLE "tb_employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"position" text NOT NULL,
	"shift" text NOT NULL,
	"shift_start_time" text NOT NULL,
	"shift_end_time" text NOT NULL,
	"salary_in_cents" integer NOT NULL,
	"hire_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tb_employees" ADD CONSTRAINT "tb_employees_user_id_tb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tb_employees" ADD CONSTRAINT "tb_employees_user_id_unique" UNIQUE("user_id");
