import { z } from "zod";

export const placesSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"), // This field is required and must not be empty
  address: z.string().nullable().optional(),
  club_id: z.number().nullable().optional(),
  club_name: z.string().nullable().optional(),
  club_review1: z.string().nullable().optional(),
  club_review2: z.string().nullable().optional(),
  club_review3: z.string().nullable().optional(),
  club_website: z.string().url().nullable().optional(),
  contact: z.string().nullable().optional(),
  courts: z.string().nullable().optional(),
  date_added: z.string().nullable().optional(),
  fee: z.string().nullable().optional(),
  field1: z.string().nullable().optional(),
  field2: z.string().nullable().optional(),
  field3: z.string().nullable().optional(),
  flooring: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  map_link: z.string().url().nullable().optional(),
  other_link1: z.string().url().nullable().optional(),
  other_link2: z.string().url().nullable().optional(),
  other_link3: z.string().url().nullable().optional(),
  others: z.string().nullable().optional(),
  schedule: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
});