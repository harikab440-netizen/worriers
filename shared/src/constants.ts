export const ITEM_CATEGORIES = [
  'Electronics',
  'Keys',
  'Wallets and cards',
  'Bags',
  'Clothing',
  'Books and stationery',
  'IDs and documents',
  'Jewelry and accessories',
  'Sports equipment',
  'Other'
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const DEFAULT_CAMPUS_LOCATIONS = [
  'Library',
  'Student center',
  'Cafeteria',
  'Main quad',
  'Science building',
  'Arts building',
  'Sports center',
  'Residence halls',
  'Transit stop',
  'Other / exact location shared privately'
] as const;

export const LISTING_TYPES = ['lost', 'found'] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const LISTING_STATUSES = ['active', 'returned', 'closed'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const CONTACT_REQUEST_STATUSES = ['pending', 'responded', 'closed'] as const;
export type ContactRequestStatus = (typeof CONTACT_REQUEST_STATUSES)[number];

export const REPLY_PREFERENCES = ['in_app', 'email_notification'] as const;
export type ReplyPreference = (typeof REPLY_PREFERENCES)[number];

export const SORT_OPTIONS = ['newest', 'oldest'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
] as const;
