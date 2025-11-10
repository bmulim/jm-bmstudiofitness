CREATE TABLE "tb_studio_expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"amount_in_cents" integer NOT NULL,
	"due_date" date NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"payment_date" date,
	"payment_method" text NOT NULL,
	"recurrent" boolean DEFAULT false NOT NULL,
	"notes" text,
	"attachment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tb_studio_expenses" ADD CONSTRAINT "tb_studio_expenses_created_by_tb_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."tb_users"("id") ON DELETE no action ON UPDATE no action;