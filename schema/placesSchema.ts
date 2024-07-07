import { z } from "zod";

export const placesSchema = z.object({
  place_id: z.number().optional(),
  place_name: z.string().min(1, "Place name is required"),
  place_type: z.string().min(1, "Place type is required"),
  address: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  additional_info: z.record(z.unknown()).nullable().optional(), // For JSON type
  created_at: z.string().nullable().optional(),
  created_user: z.string().optional(),
  modified_at: z.string().nullable().optional(),
  modified_user: z.string().optional(),
});

// 클럽 스키마도 추가할 수 있습니다
export const clubsSchema = z.object({
  club_id: z.number().optional(),
  club_name: z.string().min(1, "Club name is required"),
  contact_info: z.string().nullable().optional(),
  additional_info: z.record(z.unknown()).nullable().optional(),
  created_at: z.string().nullable().optional(),
  created_user: z.string(),
  modified_at: z.string().nullable().optional(),
  modified_user: z.string(),
});

// 클럽과 장소의 매핑을 위한 스키마
export const clubPlaceMappingSchema = z.object({
  mapping_id: z.number().optional(),
  club_id: z.number(),
  place_id: z.number(),
  additional_info: z.record(z.unknown()).nullable().optional(),
  created_at: z.string().nullable().optional(),
  created_user: z.string(),
  modified_at: z.string().nullable().optional(),
  modified_user: z.string(),
});

// 클럽-장소 스케줄을 위한 스키마
export const clubPlaceScheduleSchema = z.object({
  schedule_id: z.number().optional(),
  mapping_id: z.number(),
  day_of_week: z.number().min(0).max(6),
  operation_start_time: z.string(),
  operation_end_time: z.string(),
  created_at: z.string().nullable().optional(),
  created_user: z.string(),
  modified_at: z.string().nullable().optional(),
  modified_user: z.string(),
});