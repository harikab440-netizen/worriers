import { describe, it, expect } from 'vitest';
import {
  CreateListingSchema,
  CreateContactRequestSchema,
  ListingQuerySchema,
  SuggestCategoryResponseSchema,
  ImproveDescriptionResponseSchema,
  SignUpSchema,
  isNotMoreThanOneDayInFuture
} from '../src/index.js';

describe('Shared Schemas Validation', () => {
  describe('SignUpSchema', () => {
    it('accepts valid signup payload', () => {
      const valid = {
        email: 'student@campus.edu',
        password: 'securePassword123',
        display_name: 'Alex Student'
      };
      const result = SignUpSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects short passwords and invalid emails', () => {
      const invalid = {
        email: 'not-an-email',
        password: '123',
        display_name: 'A'
      };
      const result = SignUpSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(3);
      }
    });
  });

  describe('CreateListingSchema', () => {
    const validListing = {
      type: 'lost' as const,
      title: 'Hydroflask Water Bottle',
      description: 'Left a blue 32oz hydroflask in the library second floor study area.',
      category: 'Other' as const,
      location_id: '123e4567-e89b-12d3-a456-426614174000',
      location_detail: 'Table 4 near window',
      occurred_on: '2026-11-12',
      contact_preference: 'in_app' as const,
      consent: true
    };

    it('validates a correct listing payload', () => {
      const result = CreateListingSchema.safeParse(validListing);
      expect(result.success).toBe(true);
    });

    it('rejects short title or description', () => {
      const result = CreateListingSchema.safeParse({
        ...validListing,
        title: 'Keys',
        description: 'Lost keys.'
      });
      expect(result.success).toBe(false);
    });

    it('rejects without consent', () => {
      const result = CreateListingSchema.safeParse({
        ...validListing,
        consent: false
      });
      expect(result.success).toBe(false);
    });

    it('rejects future dates more than 1 day ahead', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const dateStr = futureDate.toISOString().split('T')[0];

      const result = CreateListingSchema.safeParse({
        ...validListing,
        occurred_on: dateStr
      });
      expect(result.success).toBe(false);
    });
  });

  describe('CreateContactRequestSchema', () => {
    it('validates message bounds', () => {
      const valid = {
        message: 'Hello, I think I found your water bottle at the library desk.',
        reply_preference: 'in_app'
      };
      expect(CreateContactRequestSchema.safeParse(valid).success).toBe(true);

      const tooShort = {
        message: 'Found it',
        reply_preference: 'in_app'
      };
      expect(CreateContactRequestSchema.safeParse(tooShort).success).toBe(false);
    });
  });

  describe('ListingQuerySchema', () => {
    it('applies defaults correctly', () => {
      const parsed = ListingQuerySchema.parse({});
      expect(parsed.sort).toBe('newest');
      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(12);
    });

    it('validates custom filters', () => {
      const parsed = ListingQuerySchema.parse({
        type: 'found',
        category: 'Electronics',
        page: '2',
        limit: '20'
      });
      expect(parsed.type).toBe('found');
      expect(parsed.category).toBe('Electronics');
      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(20);
    });
  });

  describe('AI Schemas', () => {
    it('validates category response', () => {
      const valid = {
        category: 'Electronics',
        confidence: 0.95,
        reason: 'Item is an iPhone 14 Pro.'
      };
      expect(SuggestCategoryResponseSchema.safeParse(valid).success).toBe(true);
    });

    it('validates description improvement response', () => {
      const valid = {
        improved_description: 'Found a black leather wallet containing campus ID cards near the cafeteria entrance.',
        warnings: ['Removed phone number from text']
      };
      expect(ImproveDescriptionResponseSchema.safeParse(valid).success).toBe(true);
    });
  });
});
