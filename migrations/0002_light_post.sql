CREATE TABLE IF NOT EXISTS "rows" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"applicationId" uuid,
	"permissions" text[],
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rows" ADD CONSTRAINT "rows_name_applicationId" PRIMARY KEY("name","applicationId");

CREATE UNIQUE INDEX IF NOT EXISTS "roles_id_index" ON "rows" ("id");
DO $$ BEGIN
 ALTER TABLE "rows" ADD CONSTRAINT "rows_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "application"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
