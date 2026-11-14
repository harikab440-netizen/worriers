import { describe, it, expect, beforeEach } from 'vitest';
import { dbService } from '../src/services/db.js';

describe('DatabaseService Unit Tests (Direct Business Logic)', () => {
  const userA = 'user-test-a';
  const userB = 'user-test-b';

  beforeEach(async () => {
    await dbService.ensureProfile(userA, 'Alice Smith');
    await dbService.ensureProfile(userB, 'Bob Jones');
  });

  it('manages listings lifecycle with strict ownership', async () => {
    // 1. Create listing
    const listing = await dbService.createListing(userA, 'Alice Smith', {
      type: 'found',
      title: 'Wireless Beats Headphones',
      description: 'Found black Beats Studio headphones near the gym locker room benches.',
      category: 'Electronics',
      location_id: '00000000-0000-0000-0000-000000000007', // Sports center
      location_detail: 'Bench 3',
      occurred_on: '2026-11-12',
      contact_preference: 'in_app',
      consent: true
    });

    expect(listing.id).toBeDefined();
    expect(listing.owner_id).toBe(userA);
    expect(listing.status).toBe('active');

    // 2. Query filter
    const found = await dbService.getListings({
      type: 'found',
      category: 'Electronics',
      q: 'headphones',
      sort: 'newest',
      page: 1,
      limit: 10
    });
    expect(found.listings.some((l) => l.id === listing.id)).toBe(true);

    // 3. User B attempts to edit User A's listing -> throws forbidden error
    await expect(
      dbService.updateListing(listing.id, userB, {
        title: 'Malicious modification'
      })
    ).rejects.toThrow(/Forbidden/);

    // 4. User A edits own listing -> succeeds
    const updated = await dbService.updateListing(listing.id, userA, {
      title: 'Wireless Beats Headphones (Black Matte)'
    });
    expect(updated?.title).toBe('Wireless Beats Headphones (Black Matte)');

    // 5. Anti-self-contact check
    await expect(
      dbService.createContactRequest(listing.id, userA, 'Alice Smith', {
        message: 'Trying to contact myself',
        reply_preference: 'in_app'
      })
    ).rejects.toThrow(/cannot send a contact request to your own/);

    // 6. User B sends contact request -> succeeds
    const req = await dbService.createContactRequest(listing.id, userB, 'Bob Jones', {
      message: 'Hello Alice, these might be mine! Left them after basketball practice.',
      reply_preference: 'in_app'
    });
    expect(req.id).toBeDefined();
    expect(req.status).toBe('pending');

    // 7. Prevent duplicate pending request from User B
    await expect(
      dbService.createContactRequest(listing.id, userB, 'Bob Jones', {
        message: 'Spam duplicate message',
        reply_preference: 'in_app'
      })
    ).rejects.toThrow(/already have a pending/);

    // 8. User A responds
    const responded = await dbService.respondContactRequest(req.id, userA, {
      owner_response: 'Great! Please meet me at the Sports Center front desk at 3pm.',
      status: 'responded'
    });
    expect(responded?.status).toBe('responded');
    expect(responded?.owner_response).toContain('meet me at the Sports Center');

    // 9. User B cannot respond to request sent to User A
    await expect(
      dbService.respondContactRequest(req.id, userB, {
        owner_response: 'Unauthorized response',
        status: 'responded'
      })
    ).rejects.toThrow(/Forbidden/);

    // 10. Mark listing as returned
    const returned = await dbService.updateListing(listing.id, userA, {
      status: 'returned'
    });
    expect(returned?.status).toBe('returned');

    // Inactive listing not shown in public active search
    const activeSearch = await dbService.getListings({
      type: 'found',
      q: 'headphones',
      sort: 'newest',
      page: 1,
      limit: 10
    });
    expect(activeSearch.listings.some((l) => l.id === listing.id)).toBe(false);

    // But owner can still see it in dashboard
    const ownerListings = await dbService.getUserListings(userA);
    expect(ownerListings.some((l) => l.id === listing.id)).toBe(true);
  });
});
