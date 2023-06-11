CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"applicationId" uuid,
	"password" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_applicationId" PRIMARY KEY("email","applicationId");

CREATE UNIQUE INDEX IF NOT EXISTS "users_id_index" ON "users" ("id");
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
