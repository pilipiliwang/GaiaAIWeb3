import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAgentSchema, insertGameStateSchema, insertTransactionSchema, insertLogSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get user's session data (mock user for now - add auth later)
  app.get("/api/session", async (req, res) => {
    // For now, use a default user
    const userId = "demo-user";
    let user = await storage.getUserByUsername(userId);
    
    if (!user) {
      user = await storage.createUser({ username: userId, password: "demo" });
    }
    
    res.json({ userId: user.id, username: user.username });
  });

  // Game state endpoints
  app.get("/api/game-state", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let state = await storage.getGameState(user.id);
      
      if (!state) {
        // Create default game state
        state = await storage.createGameState({
          userId: user.id,
          currency: 1000,
          hasOnboarded: false,
          selectedAgentId: null,
          myAgentId: null,
          activeQuest: null,
          mapNodes: [],
        });
      }

      res.json(state);
    } catch (error) {
      console.error("Error fetching game state:", error);
      res.status(500).json({ error: "Failed to fetch game state" });
    }
  });

  app.post("/api/game-state", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updates = req.body;
      const state = await storage.updateGameState(user.id, updates);
      
      res.json(state);
    } catch (error) {
      console.error("Error updating game state:", error);
      res.status(500).json({ error: "Failed to update game state" });
    }
  });

  // Agent endpoints
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      console.error("Error fetching agent:", error);
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const agentData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent({ ...agentData, userId: user.id });
      
      res.json(agent);
    } catch (error) {
      console.error("Error creating agent:", error);
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  app.patch("/api/agents/:id", async (req, res) => {
    try {
      const updates = { ...req.body };
      
      // Convert birthDate to Date if present (can be string or number timestamp)
      if (updates.birthDate !== undefined) {
        if (typeof updates.birthDate === 'string') {
          updates.birthDate = new Date(updates.birthDate);
        } else if (typeof updates.birthDate === 'number') {
          updates.birthDate = new Date(updates.birthDate);
        }
      }
      
      const agent = await storage.updateAgent(req.params.id, updates);
      
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      
      res.json(agent);
    } catch (error) {
      console.error("Error updating agent:", error);
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      await storage.deleteAgent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting agent:", error);
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  // Transaction endpoints
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const transactions = await storage.getTransactions(user.id);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction({ ...transactionData, userId: user.id });
      
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Log endpoints
  app.get("/api/logs", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const logs = await storage.getLogs(user.id);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.post("/api/logs", async (req, res) => {
    try {
      const userId = "demo-user";
      const user = await storage.getUserByUsername(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const logData = insertLogSchema.parse(req.body);
      const log = await storage.createLog({ ...logData, userId: user.id });
      
      res.json(log);
    } catch (error) {
      console.error("Error creating log:", error);
      res.status(500).json({ error: "Failed to create log" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/agents", async (req, res) => {
    try {
      const agents = await storage.getAllAgents();
      res.json(agents);
    } catch (error) {
      console.error("Error fetching all agents:", error);
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  return httpServer;
}
