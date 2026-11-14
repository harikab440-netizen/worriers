import { z } from 'zod';
import {
  ITEM_CATEGORIES,
  LISTING_TYPES,
  LISTING_STATUSES,
  CONTACT_REQUEST_STATUSES,
  REPLY_PREFERENCES,
  SORT_OPTIONS
} from './constants.js';

// Helper for date validation (not more than 1 day in the future)
export const isNotMoreThanOneDayInFuture = (dateStr: string): boolean => {
  const inputDate = new Date(dateStr);
  if (isNaN(inputDate.getTime())) return false;
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 1);
  maxDate.setHours(23, 59, 59, 999);
  return inputDate <= maxDate;
};

// ==========================================
// Auth Schemas
// ==========================================

export const SignUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must not exceed 72 characters'),
  display_name: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must not exceed 50 characters')
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export type SignInInput = z.infer<typeof SignInSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address')
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must not exceed 72 characters')
});

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const UpdateProfileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must not exceed 50 characters')
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// ==========================================
// Campus Location Schemas
// ==========================================

export const CampusLocationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  is_active: z.boolean(),
  sort_order: z.number().int()
});

export type CampusLocation = z.infer<typeof CampusLocationSchema>;

// ==========================================
// Listing Schemas
// ==========================================

export const CreateListingSchema = z.object({
  type: z.enum(LISTING_TYPES, {
    errorMap: () => ({ message: 'Please select lost or found' })
  }),
  title: z
    .string()
    .trim()
    .min(5, 'Title must be between 5 and 100 characters')
    .max(100, 'Title must be between 5 and 100 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be between 20 and 2,000 characters')
    .max(2000, 'Description must be between 20 and 2,000 characters'),
  category: z.enum(ITEM_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  location_id: z.string().uuid('Please select a valid campus location'),
  location_detail: z
    .string()
    .trim()
    .max(120, 'Location detail cannot exceed 120 characters')
    .optional()
    .nullable(),
  occurred_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (val) => isNotMoreThanOneDayInFuture(val),
      'Date cannot be more than 1 day in the future'
    ),
  image_path: z.string().trim().optional().nullable(),
  contact_preference: z.enum(REPLY_PREFERENCES).default('in_app'),
  consent: z
    .boolean()
    .refine((val) => val === true, 'You must confirm consent to post')
});

export type CreateListingInput = z.infer<typeof CreateListingSchema>;

export const UpdateListingSchema = z.object({
  type: z.enum(LISTING_TYPES).optional(),
  title: z
    .string()
    .trim()
    .min(5, 'Title must be between 5 and 100 characters')
    .max(100, 'Title must be between 5 and 100 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be between 20 and 2,000 characters')
    .max(2000, 'Description must be between 20 and 2,000 characters')
    .optional(),
  category: z.enum(ITEM_CATEGORIES).optional(),
  location_id: z.string().uuid().optional(),
  location_detail: z
    .string()
    .trim()
    .max(120, 'Location detail cannot exceed 120 characters')
    .optional()
    .nullable(),
  occurred_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
      (val) => isNotMoreThanOneDayInFuture(val),
      'Date cannot be more than 1 day in the future'
    )
    .optional(),
  image_path: z.string().trim().optional().nullable(),
  status: z.enum(LISTING_STATUSES).optional()
});

export type UpdateListingInput = z.infer<typeof UpdateListingSchema>;

export const ListingQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  type: z.enum(LISTING_TYPES).optional(),
  category: z.enum(ITEM_CATEGORIES).optional(),
  location_id: z.string().uuid().optional(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  sort: z.enum(SORT_OPTIONS).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

export type ListingQueryParams = z.infer<typeof ListingQuerySchema>;

export interface ProfileSummary {
  id: string;
  display_name: string;
}

export interface ListingItem {
  id: string;
  owner_id: string;
  type: (typeof LISTING_TYPES)[number];
  title: string;
  description: string;
  category: (typeof ITEM_CATEGORIES)[number];
  location_id: string;
  location_name?: string;
  location_detail: string | null;
  occurred_on: string;
  image_path: string | null;
  image_url?: string | null;
  status: (typeof LISTING_STATUSES)[number];
  created_at: string;
  updated_at: string;
  owner?: ProfileSummary;
}

export interface PaginatedListings {
  listings: ListingItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// ==========================================
// Contact Request Schemas
// ==========================================

export const CreateContactRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, 'Message must be between 10 and 1,000 characters')
    .max(1000, 'Message must be between 10 and 1,000 characters'),
  reply_preference: z.enum(REPLY_PREFERENCES, {
    errorMap: () => ({ message: 'Please select your preferred reply method' })
  })
});

export type CreateContactRequestInput = z.infer<
  typeof CreateContactRequestSchema
>;

export const RespondContactRequestSchema = z.object({
  owner_response: z
    .string()
    .trim()
    .min(1, 'Response message is required')
    .max(2000, 'Response cannot exceed 2,000 characters'),
  status: z.enum(['responded', 'closed']).default('responded')
});

export type RespondContactRequestInput = z.infer<
  typeof RespondContactRequestSchema
>;

export interface ContactRequestItem {
  id: string;
  listing_id: string;
  sender_id: string;
  message: string;
  reply_preference: (typeof REPLY_PREFERENCES)[number];
  status: (typeof CONTACT_REQUEST_STATUSES)[number];
  owner_response: string | null;
  responded_at: string | null;
  created_at: string;
  listing?: {
    id: string;
    title: string;
    type: (typeof LISTING_TYPES)[number];
    category: (typeof ITEM_CATEGORIES)[number];
    status: (typeof LISTING_STATUSES)[number];
    owner_id: string;
  };
  sender?: ProfileSummary;
}

// ==========================================
// AI Schemas
// ==========================================

export const SuggestCategoryRequestSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(2000)
});

export type SuggestCategoryRequest = z.infer<
  typeof SuggestCategoryRequestSchema
>;

export const SuggestCategoryResponseSchema = z.object({
  category: z.enum(ITEM_CATEGORIES),
  confidence: z.number().min(0).max(1),
  reason: z.string().max(240)
});

export type SuggestCategoryResponse = z.infer<
  typeof SuggestCategoryResponseSchema
>;

export const ImproveDescriptionRequestSchema = z.object({
  description: z.string().trim().min(10).max(2000)
});

export type ImproveDescriptionRequest = z.infer<
  typeof ImproveDescriptionRequestSchema
>;

export const ImproveDescriptionResponseSchema = z.object({
  improved_description: z.string().min(20).max(2000),
  warnings: z.array(z.string().max(240))
});

export type ImproveDescriptionResponse = z.infer<
  typeof ImproveDescriptionResponseSchema
>;
