import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === BASE SCHEMAS ===
export const insertLeadSchema = createInsertSchema(leads, {
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is too short").max(20, "Phone number is too long"),
  name: z.string().min(2, "Name is required"),
}).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type CreateLeadRequest = InsertLead;
export type UpdateLeadRequest = Partial<InsertLead>;

export type LeadResponse = Lead;
export type LeadsListResponse = Lead[];

export interface LeadsQueryParams {
  search?: string;
}
