import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { validateImageSignature } from '../src/middleware/upload.js';

describe('Server API Endpoints & Authorization Tests', () => {
  const tokenUser1 = 'Bearer mock-user-1';
  const tokenUser2 = 'Bearer mock-user-2';

  let testListingId: string;
  let testContactRequestId: string;

  beforeAll(async () => {
    // Seed initial test data
  });

  describe('Health & Metadata', () => {
    it('GET /api/v1/health returns status ok', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });

    it('GET /api/v1/locations returns campus locations', async () => {
      const res = await request(app).get('/api/v1/locations');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].name).toBeDefined();
    });
  });

  describe('Listings API & Ownership', () => {
    it('requires authentication to create a listing', async () => {
      const res = await request(app)
        .post('/api/v1/listings')
        .send({
          type: 'lost',
          title: 'Unauthenticated Test Item',
          description: 'This listing attempt should be rejected because no token is present.',
          category: 'Electronics',
          location_id: '00000000-0000-0000-0000-000000000001',
          occurred_on: '2026-11-12',
          consent: true
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('creates a listing when authenticated as user 1', async () => {
      const res = await request(app)
        .post('/api/v1/listings')
        .set('Authorization', tokenUser1)
        .send({
          type: 'lost',
          title: 'Silver MacBook Pro 14',
          description: 'Left in the Library 3rd floor quiet zone near window table 12.',
          category: 'Electronics',
          location_id: '00000000-0000-0000-0000-000000000001',
          location_detail: 'Quiet study zone',
          occurred_on: '2026-11-12',
          consent: true
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe('Silver MacBook Pro 14');
      expect(res.body.status).toBe('active');
      expect(res.body.owner_id).toBe('mock-user-1');
      testListingId = res.body.id;
    });

    it('allows public access to search and view active listings', async () => {
      const res = await request(app).get('/api/v1/listings?type=lost&category=Electronics');
      expect(res.status).toBe(200);
      expect(res.body.listings).toBeDefined();
      expect(Array.isArray(res.body.listings)).toBe(true);
      expect(res.body.total).toBeGreaterThanOrEqual(1);

      // Check single view
      const single = await request(app).get(`/api/v1/listings/${testListingId}`);
      expect(single.status).toBe(200);
      expect(single.body.id).toBe(testListingId);
    });

    it('allows owner (user 1) to edit their listing', async () => {
      const res = await request(app)
        .patch(`/api/v1/listings/${testListingId}`)
        .set('Authorization', tokenUser1)
        .send({
          title: 'Silver MacBook Pro 14 (Space Grey Sleeve)'
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Silver MacBook Pro 14 (Space Grey Sleeve)');
    });

    it('denies non-owner (user 2) from editing user 1 listing (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/v1/listings/${testListingId}`)
        .set('Authorization', tokenUser2)
        .send({
          title: 'Attempted Hijack Title'
        });

      expect(res.status).toBe(403);
    });

    it('denies non-owner (user 2) from deleting user 1 listing (403 Forbidden)', async () => {
      const res = await request(app)
        .delete(`/api/v1/listings/${testListingId}`)
        .set('Authorization', tokenUser2);

      expect(res.status).toBe(403);
    });
  });

  describe('Contact Requests Flow & Anti-Self-Contact', () => {
    it('prevents owner (user 1) from sending a contact request to their own listing', async () => {
      const res = await request(app)
        .post(`/api/v1/listings/${testListingId}/contact-requests`)
        .set('Authorization', tokenUser1)
        .send({
          message: 'Can I contact myself about my own laptop?',
          reply_preference: 'in_app'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('cannot send a contact request to your own');
    });

    it('allows another user (user 2) to send a contact request to user 1 listing', async () => {
      const res = await request(app)
        .post(`/api/v1/listings/${testListingId}/contact-requests`)
        .set('Authorization', tokenUser2)
        .send({
          message: 'Hi, I believe the library front desk has held this item for pickup!',
          reply_preference: 'in_app'
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.status).toBe('pending');
      testContactRequestId = res.body.id;
    });

    it('prevents duplicate pending contact requests from the same user', async () => {
      const res = await request(app)
        .post(`/api/v1/listings/${testListingId}/contact-requests`)
        .set('Authorization', tokenUser2)
        .send({
          message: 'Second duplicate message attempting spam.',
          reply_preference: 'in_app'
        });

      expect(res.status).toBe(409);
    });

    it('shows the request in user 1 dashboard received list and user 2 sent list', async () => {
      // User 1 received
      const res1 = await request(app)
        .get('/api/v1/me/contact-requests')
        .set('Authorization', tokenUser1);
      expect(res1.status).toBe(200);
      expect(res1.body.received.some((r: any) => r.id === testContactRequestId)).toBe(true);

      // User 2 sent
      const res2 = await request(app)
        .get('/api/v1/me/contact-requests')
        .set('Authorization', tokenUser2);
      expect(res2.status).toBe(200);
      expect(res2.body.sent.some((r: any) => r.id === testContactRequestId)).toBe(true);
    });

    it('allows listing owner (user 1) to respond to the contact request', async () => {
      const res = await request(app)
        .patch(`/api/v1/contact-requests/${testContactRequestId}`)
        .set('Authorization', tokenUser1)
        .send({
          owner_response: 'Thank you so much! I will go to the front desk with my student ID.',
          status: 'responded'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('responded');
      expect(res.body.owner_response).toBeDefined();
    });

    it('denies non-owner from responding to contact request (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/v1/contact-requests/${testContactRequestId}`)
        .set('Authorization', tokenUser2)
        .send({
          owner_response: 'Attempt by sender to fake owner response',
          status: 'responded'
        });

      expect(res.status).toBe(403);
    });
  });

  describe('Security & File Validation', () => {
    it('validates magic bytes for JPEG and PNG images', () => {
      const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x00]);
      expect(validateImageSignature(validPng).valid).toBe(true);
      expect(validateImageSignature(validPng).detectedMime).toBe('image/png');

      const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
      expect(validateImageSignature(validJpeg).valid).toBe(true);
      expect(validateImageSignature(validJpeg).detectedMime).toBe('image/jpeg');

      const textFile = Buffer.from('Hello world this is not an image');
      expect(validateImageSignature(textFile).valid).toBe(false);
    });
  });

  describe('AI Endpoints Graceful Fallback', () => {
    it('returns graceful 503 fallback when GEMINI_API_KEY is not configured', async () => {
      const res = await request(app)
        .post('/api/v1/ai/suggest-category')
        .set('Authorization', tokenUser1)
        .send({
          title: 'Found Airpods Case',
          description: 'White Apple Airpods charging case found in the cafeteria.'
        });

      // Since GEMINI_API_KEY is not set in test environment, it returns 503 with fallback info
      expect(res.status).toBe(503);
      expect(res.body.fallback_category).toBe('Other');
    });

    it('handles description improvement fallback gracefully', async () => {
      const res = await request(app)
        .post('/api/v1/ai/improve-description')
        .set('Authorization', tokenUser1)
        .send({
          description: 'Found a blue backpack near the library stairs yesterday afternoon.'
        });

      expect(res.status).toBe(503);
      expect(res.body.improved_description).toBeDefined();
    });
  });
});
