import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agents/NFTs table
export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  color: text("color").notNull(),
  avatarUrl: text("avatar_url"),
  positionX: real("position_x").notNull().default(400),
  positionY: real("position_y").notNull().default(400),
  targetX: real("target_x").notNull().default(400),
  targetY: real("target_y").notNull().default(400),
  personality: text("personality").notNull(),
  statsHappiness: real("stats_happiness").notNull().default(100),
  statsEnergy: real("stats_energy").notNull().default(100),
  statsFriendship: real("stats_friendship").notNull().default(50),
  statsSmarts: real("stats_smarts").notNull().default(50),
  skills: jsonb("skills").notNull().default([]),
  inventory: jsonb("inventory").notNull().default([]),
  thoughts: jsonb("thoughts").notNull().default([]),
  currentAction: text("current_action").notNull().default('idle'),
  talkingTo: text("talking_to"),
  isUserOwned: boolean("is_user_owned").notNull().default(false),
  dna: text("dna").notNull().unique(),
  rarity: text("rarity").notNull().default('Common'),
  birthDate: timestamp("birth_date").defaultNow().notNull(),
  price: integer("price"),
  autoLifeEnabled: boolean("auto_life_enabled").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User game state (currency, active quest, etc)
export const gameState = pgTable("game_state", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  currency: integer("currency").notNull().default(1000),
  selectedAgentId: varchar("selected_agent_id"),
  myAgentId: varchar("my_agent_id"),
  hasOnboarded: boolean("has_onboarded").notNull().default(false),
  activeQuest: jsonb("active_quest"),
  mapNodes: jsonb("map_nodes").notNull().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Shop transaction history
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentId: varchar("agent_id").references(() => agents.id, { onDelete: 'set null' }),
  itemName: text("item_name").notNull(),
  cost: integer("cost").notNull(),
  isAutonomous: boolean("is_autonomous").notNull().default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Activity logs
export const logs = pgTable("logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  text: text("text").notNull(),
  type: text("type").notNull().default('info'),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAgentSchema = createInsertSchema(agents, {
  birthDate: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameStateSchema = createInsertSchema(gameState).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export const insertLogSchema = createInsertSchema(logs).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type GameState = typeof gameState.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
