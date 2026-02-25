import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  real,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Plan first (referenced by User.planId)
export const plan = pgTable("Plan", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  credits: integer("credits").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  isPopular: boolean("isPopular").notNull().default(false),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

// Auth.js / NextAuth tables
export const user = pgTable("User", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  role: text("role").notNull().default("user"),
  public: boolean("public").notNull().default(true),
  credits: integer("credits").notNull().default(0),
  currentPeriodEnd: timestamp("currentPeriodEnd", { mode: "date" }),
  planId: integer("planId").references(() => plan.id),
  subscriptionId: text("subscriptionId").unique(),
  subscriptionStatus: text("subscriptionStatus"),
});

export const account = pgTable(
  "Account",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (t) => [
    uniqueIndex("Account_provider_providerAccountId_key").on(
      t.provider,
      t.providerAccountId
    ),
  ]
);

export const session = pgTable("Session", {
  id: serial("id").primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: integer("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationToken = pgTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [uniqueIndex("VerificationToken_identifier_token_key").on(t.identifier, t.token)]
);

// App tables
export const humanization = pgTable("Humanization", {
  id: serial("id").primaryKey(),
  title: text("title"),
  inputText: text("inputText").notNull(),
  outputText: text("outputText").notNull(),
  language: text("language").notNull(),
  level: text("level").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  userId: integer("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const generation = pgTable("Generation", {
  id: text("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  settings: jsonb("settings").notNull(),
  outline: jsonb("outline"),
  content: text("content"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
  currentStep: text("currentStep").notNull().default("settings"),
  status: text("status").default("in_progress"),
});

export const webhookLog = pgTable(
  "WebhookLog",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(),
    status: text("status").notNull(),
    payload: text("payload").notNull(),
    error: text("error"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    processingTimeMs: integer("processingTimeMs"),
    requestBody: text("requestBody"),
    requestHeaders: text("requestHeaders"),
    responseBody: text("responseBody"),
    responseStatus: integer("responseStatus"),
  },
  (t) => [
    index("WebhookLog_createdAt_idx").on(t.createdAt),
    index("WebhookLog_type_idx").on(t.type),
    index("WebhookLog_status_idx").on(t.status),
    index("WebhookLog_responseStatus_idx").on(t.responseStatus),
  ]
);

// Relations (optional, for typed queries)
export const userRelations = relations(user, ({ one, many }) => ({
  accounts: many(account),
  sessions: many(session),
  humanizations: many(humanization),
  generations: many(generation),
  plan: one(plan),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user),
}));

export const planRelations = relations(plan, ({ many }) => ({
  users: many(user),
}));

export const humanizationRelations = relations(humanization, ({ one }) => ({
  user: one(user),
}));

export const generationRelations = relations(generation, ({ one }) => ({
  user: one(user),
}));

// Inferred types for use in app
export type User = typeof user.$inferSelect;
export type Plan = typeof plan.$inferSelect;
export type Humanization = typeof humanization.$inferSelect;
export type Generation = typeof generation.$inferSelect;
export type WebhookLog = typeof webhookLog.$inferSelect;
