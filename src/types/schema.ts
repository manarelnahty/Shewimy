import { z } from "zod";

/**
 * ============================================================================
 * DRD Schema & Entity Definitions
 * Enforces strict typing, runtime validation (Zod), and zero `any` usage.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// Item Entity (Products, Portfolio Works, Bespoke Woodcraft)
// ----------------------------------------------------------------------------
export const ItemCategorySchema = z.enum([
  "living_room",
  "dining_room",
  "bedroom",
  "architectural_woodwork",
  "doors_and_wall_cladding",
  "bespoke_custom",
]);

export type ItemCategory = z.infer<typeof ItemCategorySchema>;

export const ItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  titleAr: z.string().min(2, "Arabic title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  descriptionAr: z.string().min(10, "Arabic description is required"),
  category: ItemCategorySchema,
  woodType: z.string().optional(),
  dimensions: z
    .object({
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
      depth: z.number().positive().optional(),
      unit: z.enum(["cm", "m", "mm"]).default("cm"),
    })
    .optional(),
  featured: z.boolean().default(false),
  imageUrl: z.string().url("Valid image URL required"),
  gallery: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(["available", "made_to_order", "archived"]).default("made_to_order"),
  estimatedDeliveryWeeks: z.number().int().positive().optional(),
  price: z
    .object({
      amount: z.number().nonnegative(),
      currency: z.literal("EGP").default("EGP"),
      isStartingFrom: z.boolean().default(true),
    })
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Item = z.infer<typeof ItemSchema>;

// ----------------------------------------------------------------------------
// Lead Entity (Customer Requests, Quotation & Consultation Leads)
// ----------------------------------------------------------------------------
export const LeadStatusSchema = z.enum([
  "new",
  "contacted",
  "site_visit_scheduled",
  "proposal_sent",
  "converted",
  "closed",
]);

export type LeadStatus = z.infer<typeof LeadStatusSchema>;

export const LeadSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z
    .string()
    .min(10, "Valid phone number required")
    .regex(/^[0-9+() -]+$/, "Invalid phone format"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  projectType: z.enum([
    "residential_villa",
    "residential_apartment",
    "commercial_office",
    "hospitality",
    "bespoke_furniture_single",
    "other",
  ]),
  branchId: z.string().optional(),
  status: LeadStatusSchema.default("new"),
  notes: z.string().max(1000).optional(),
  budgetRange: z
    .enum(["standard", "premium", "luxury", "custom_bespoke"])
    .optional(),
  source: z.enum(["website_hero", "portfolio_item", "contact_page", "whatsapp", "direct_call"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

export const CreateLeadInputSchema = LeadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;

// ----------------------------------------------------------------------------
// Branch Entity (Showrooms, Design Studios & Woodworking Facilities)
// ----------------------------------------------------------------------------
export const BranchWorkingHoursSchema = z.object({
  days: z.string(),
  daysAr: z.string(),
  hours: z.string(),
  hoursAr: z.string(),
});

export const BranchSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  nameAr: z.string().min(2),
  type: z.enum(["flagship_showroom", "design_studio", "factory_workshop"]),
  city: z.string(),
  cityAr: z.string(),
  address: z.string(),
  addressAr: z.string(),
  phones: z.array(z.string()).min(1),
  email: z.string().email().optional(),
  workingHours: BranchWorkingHoursSchema,
  mapCoordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  googleMapsUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
});

export type Branch = z.infer<typeof BranchSchema>;

// ----------------------------------------------------------------------------
// Safe Type Guard Helpers
// ----------------------------------------------------------------------------
export function isItem(data: unknown): data is Item {
  return ItemSchema.safeParse(data).success;
}

export function isLead(data: unknown): data is Lead {
  return LeadSchema.safeParse(data).success;
}

export function isBranch(data: unknown): data is Branch {
  return BranchSchema.safeParse(data).success;
}
