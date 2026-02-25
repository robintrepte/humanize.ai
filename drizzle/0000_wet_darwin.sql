CREATE TABLE "Account" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "Generation" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"settings" jsonb NOT NULL,
	"outline" jsonb,
	"content" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"currentStep" text DEFAULT 'settings' NOT NULL,
	"status" text DEFAULT 'in_progress'
);
--> statement-breakpoint
CREATE TABLE "Humanization" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"inputText" text NOT NULL,
	"outputText" text NOT NULL,
	"language" text NOT NULL,
	"level" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"credits" integer NOT NULL,
	"description" text NOT NULL,
	"features" text[] NOT NULL,
	"isPopular" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" integer NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "Session_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" text DEFAULT 'user' NOT NULL,
	"public" boolean DEFAULT true NOT NULL,
	"credits" integer DEFAULT 0 NOT NULL,
	"currentPeriodEnd" timestamp,
	"planId" integer,
	"subscriptionId" text,
	"subscriptionStatus" text,
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_subscriptionId_unique" UNIQUE("subscriptionId")
);
--> statement-breakpoint
CREATE TABLE "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "VerificationToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "WebhookLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"payload" text NOT NULL,
	"error" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"processingTimeMs" integer,
	"requestBody" text,
	"requestHeaders" text,
	"responseBody" text,
	"responseStatus" integer
);
--> statement-breakpoint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Humanization" ADD CONSTRAINT "Humanization_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_planId_Plan_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."Plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account" USING btree ("provider","providerAccountId");--> statement-breakpoint
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken" USING btree ("identifier","token");--> statement-breakpoint
CREATE INDEX "WebhookLog_createdAt_idx" ON "WebhookLog" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "WebhookLog_type_idx" ON "WebhookLog" USING btree ("type");--> statement-breakpoint
CREATE INDEX "WebhookLog_status_idx" ON "WebhookLog" USING btree ("status");--> statement-breakpoint
CREATE INDEX "WebhookLog_responseStatus_idx" ON "WebhookLog" USING btree ("responseStatus");