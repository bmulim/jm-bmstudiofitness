ALTER TABLE "tb_comments" DROP CONSTRAINT "tb_comments_parent_id_tb_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "tb_posts" DROP CONSTRAINT "tb_posts_author_id_tb_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tb_posts" ALTER COLUMN "author_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tb_users" ADD COLUMN "deleted_at" timestamp;