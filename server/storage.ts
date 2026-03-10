import { db } from "./db";
import {
  leads,
  type LeadResponse,
  type LeadsListResponse,
  type CreateLeadRequest,
  type UpdateLeadRequest,
} from "@shared/schema";
import { eq, desc, ilike } from "drizzle-orm";

export interface IStorage {
  getLeads(search?: string): Promise<LeadsListResponse>;
  getLead(id: number): Promise<LeadResponse | undefined>;
  createLead(lead: CreateLeadRequest): Promise<LeadResponse>;
  updateLead(id: number, updates: UpdateLeadRequest): Promise<LeadResponse>;
  deleteLead(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getLeads(search?: string): Promise<LeadsListResponse> {
    if (search) {
      return await db
        .select()
        .from(leads)
        .where(ilike(leads.name, `%${search}%`))
        .orderBy(desc(leads.createdAt));
    }
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<LeadResponse | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(insertLead: CreateLeadRequest): Promise<LeadResponse> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async updateLead(id: number, updates: UpdateLeadRequest): Promise<LeadResponse> {
    const [updated] = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();
    
    if (!updated) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }
}

export const storage = new DatabaseStorage();
