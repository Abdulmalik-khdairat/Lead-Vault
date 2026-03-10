import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Public route - Create a lead from landing page
  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Protected routes - Admin dashboard
  app.get(api.leads.list.path, isAuthenticated, async (req, res) => {
    try {
      const search = req.query.search as string | undefined;
      const leads = await storage.getLeads(search);
      res.json(leads);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.leads.get.path, isAuthenticated, async (req, res) => {
    try {
      const lead = await storage.getLead(Number(req.params.id));
      if (!lead) {
        return res.status(404).json({ message: 'Lead not found' });
      }
      res.json(lead);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.leads.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.leads.update.input.parse(req.body);
      const lead = await storage.updateLead(Number(req.params.id), input);
      res.json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(404).json({ message: 'Lead not found' });
    }
  });

  app.delete(api.leads.delete.path, isAuthenticated, async (req, res) => {
    try {
      await storage.deleteLead(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ message: 'Lead not found' });
    }
  });

  return httpServer;
}

export async function seedDatabase() {
  const existingLeads = await storage.getLeads();
  if (existingLeads.length === 0) {
    await storage.createLead({
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "+1 555-0100"
    });
    await storage.createLead({
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 555-0200"
    });
    await storage.createLead({
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "+1 555-0300"
    });
  }
}
