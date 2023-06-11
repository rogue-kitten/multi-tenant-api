CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"applicationId" uuid,
	"permissions" text[],
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_name_applicationId" PRIMARY KEY("name","applicationId");

DROP TABLE "rows";
CREATE UNIQUE INDEX IF NOT EXISTS "roles_id_index" ON "roles" ("id");
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
