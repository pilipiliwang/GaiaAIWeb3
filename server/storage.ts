import { 
  users, agents, gameState, transactions, logs,
  type User, type InsertUser,
  type Agent, type InsertAgent,
  type GameState, type InsertGameState,
  type Transaction, type InsertTransaction,
  type Log, type InsertLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Agent operations
  getAgent(id: string): Promise<Agent | undefined>;
  getAgentsByUser(userId: string): Promise<Agent[]>;
  getAllAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<void>;
  
  // Game state operations
  getGameState(userId: string): Promise<GameState | undefined>;
  createGameState(state: InsertGameState): Promise<GameState>;
  updateGameState(userId: string, updates: Partial<InsertGameState>): Promise<GameState | undefined>;
  
  // Transaction operations
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Log operations
  getLogs(userId: string, limit?: number): Promise<Log[]>;
  createLog(log: InsertLog): Promise<Log>;
  
  // Admin operations
  getAllTransactions(): Promise<Transaction[]>;
  getAllUsers(): Promise<User[]>;
  getAdminStats(): Promise<{
    totalAgents: number;
    totalUsers: number;
    totalTransactions: number;
    totalRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Agent operations
  async getAgent(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async getAgentsByUser(userId: string): Promise<Agent[]> {
    return await db.select().from(agents).where(eq(agents.userId, userId));
  }

  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents);
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [newAgent] = await db.insert(agents).values(agent).returning();
    return newAgent;
  }

  async updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined> {
    const [updated] = await db
      .update(agents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAgent(id: string): Promise<void> {
    await db.delete(agents).where(eq(agents.id, id));
  }

  // Game state operations
  async getGameState(userId: string): Promise<GameState | undefined> {
    const [state] = await db.select().from(gameState).where(eq(gameState.userId, userId));
    return state || undefined;
  }

  async createGameState(state: InsertGameState): Promise<GameState> {
    const [newState] = await db.insert(gameState).values(state).returning();
    return newState;
  }

  async updateGameState(userId: string, updates: Partial<InsertGameState>): Promise<GameState | undefined> {
    const [updated] = await db
      .update(gameState)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gameState.userId, userId))
      .returning();
    return updated || undefined;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.timestamp))
      .limit(50);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  // Log operations
  async getLogs(userId: string, limit: number = 50): Promise<Log[]> {
    return await db
      .select()
      .from(logs)
      .where(eq(logs.userId, userId))
      .orderBy(desc(logs.timestamp))
      .limit(limit);
  }

  async createLog(log: InsertLog): Promise<Log> {
    const [newLog] = await db.insert(logs).values(log).returning();
    return newLog;
  }

  // Admin operations
  async getAllTransactions(): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.timestamp))
      .limit(100);
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAdminStats(): Promise<{
    totalAgents: number;
    totalUsers: number;
    totalTransactions: number;
    totalRevenue: number;
  }> {
    const allAgents = await db.select().from(agents);
    const allUsers = await db.select().from(users);
    const allTransactions = await db.select().from(transactions);
    
    const totalRevenue = allTransactions.reduce((sum, t) => sum + t.cost, 0);
    
    return {
      totalAgents: allAgents.length,
      totalUsers: allUsers.length,
      totalTransactions: allTransactions.length,
      totalRevenue,
    };
  }
}

export const storage = new DatabaseStorage();
