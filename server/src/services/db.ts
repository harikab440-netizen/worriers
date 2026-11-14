import { v4 as uuidv4 } from 'uuid';
import {
  ListingItem,
  PaginatedListings,
  ListingQueryParams,
  CreateListingInput,
  UpdateListingInput,
  CampusLocation,
  ContactRequestItem,
  CreateContactRequestInput,
  RespondContactRequestInput,
  DEFAULT_CAMPUS_LOCATIONS
} from '@campus/shared';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';

// Seed locations with fixed UUIDs for consistent referencing
const SEED_LOCATIONS: CampusLocation[] = DEFAULT_CAMPUS_LOCATIONS.map((name, index) => ({
  id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
  name,
  is_active: true,
  sort_order: (index + 1) * 10
}));

// In-Memory store for offline/testing/fallback mode
interface InMemoryDB {
  locations: CampusLocation[];
  profiles: Map<string, { id: string; display_name: string; created_at: string; updated_at: string }>;
  listings: Map<string, ListingItem>;
  contactRequests: Map<string, ContactRequestItem>;
}

const memDB: InMemoryDB = {
  locations: [...SEED_LOCATIONS],
  profiles: new Map([
    [
      'user-demo-1',
      {
        id: 'user-demo-1',
        display_name: 'Alex Rivera',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ],
    [
      'user-demo-2',
      {
        id: 'user-demo-2',
        display_name: 'Jordan Lee',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ]
  ]),
  listings: new Map(),
  contactRequests: new Map()
};

export class DatabaseService {
  // ----------------------------------------------------
  // Campus Locations
  // ----------------------------------------------------
  async getLocations(): Promise<CampusLocation[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('campus_locations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as CampusLocation[];
      }
    }
    return memDB.locations.filter((l) => l.is_active);
  }

  // ----------------------------------------------------
  // Profiles
  // ----------------------------------------------------
  async getProfile(userId: string): Promise<{ id: string; display_name: string } | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('profiles')
        .select('id, display_name')
        .eq('id', userId)
        .single();

      if (!error && data) {
        return data;
      }
    }
    const mem = memDB.profiles.get(userId);
    return mem ? { id: mem.id, display_name: mem.display_name } : null;
  }

  async ensureProfile(userId: string, displayName: string): Promise<{ id: string; display_name: string }> {
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('profiles')
        .upsert(
          { id: userId, display_name: displayName, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        )
        .select('id, display_name')
        .single();

      if (!error && data) return data;
    }

    const existing = memDB.profiles.get(userId);
    if (existing) {
      existing.display_name = displayName;
      existing.updated_at = new Date().toISOString();
      return { id: existing.id, display_name: existing.display_name };
    }

    const created = {
      id: userId,
      display_name: displayName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memDB.profiles.set(userId, created);
    return { id: created.id, display_name: created.display_name };
  }

  // ----------------------------------------------------
  // Listings: Public Browse / Search / Filter
  // ----------------------------------------------------
  async getListings(params: ListingQueryParams): Promise<PaginatedListings> {
    const {
      q,
      type,
      category,
      location_id,
      start_date,
      end_date,
      sort = 'newest',
      page = 1,
      limit = 12
    } = params;

    if (isSupabaseConfigured()) {
      let query = getSupabaseClient()
        .from('listings')
        .select(
          `
          id, owner_id, type, title, description, category, location_id,
          location_detail, occurred_on, image_path, status, created_at, updated_at,
          campus_locations (name),
          profiles (id, display_name)
        `,
          { count: 'exact' }
        )
        .eq('status', 'active');

      if (type) query = query.eq('type', type);
      if (category) query = query.eq('category', category);
      if (location_id) query = query.eq('location_id', location_id);
      if (start_date) query = query.gte('occurred_on', start_date);
      if (end_date) query = query.lte('occurred_on', end_date);
      if (q && q.trim()) {
        const queryTerm = q.trim();
        query = query.or(`title.ilike.%${queryTerm}%,description.ilike.%${queryTerm}%`);
      }

      if (sort === 'oldest') {
        query = query.order('occurred_on', { ascending: true }).order('created_at', { ascending: true });
      } else {
        query = query.order('occurred_on', { ascending: false }).order('created_at', { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, count, error } = await query.range(from, to);

      if (!error && data) {
        const listings: ListingItem[] = data.map((row: any) => ({
          id: row.id,
          owner_id: row.owner_id,
          type: row.type,
          title: row.title,
          description: row.description,
          category: row.category,
          location_id: row.location_id,
          location_name: row.campus_locations?.name,
          location_detail: row.location_detail,
          occurred_on: row.occurred_on,
          image_path: row.image_path,
          image_url: row.image_path ? this.getImagePublicUrl(row.image_path) : null,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          owner: row.profiles ? { id: row.profiles.id, display_name: row.profiles.display_name } : undefined
        }));

        const total = count ?? listings.length;
        return {
          listings,
          total,
          page,
          limit,
          total_pages: Math.ceil(total / limit) || 1
        };
      }
    }

    // In-memory fallback / testing
    let items = Array.from(memDB.listings.values()).filter((l) => l.status === 'active');

    if (type) items = items.filter((l) => l.type === type);
    if (category) items = items.filter((l) => l.category === category);
    if (location_id) items = items.filter((l) => l.location_id === location_id);
    if (start_date) items = items.filter((l) => l.occurred_on >= start_date);
    if (end_date) items = items.filter((l) => l.occurred_on <= end_date);
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      items = items.filter(
        (l) => l.title.toLowerCase().includes(term) || l.description.toLowerCase().includes(term)
      );
    }

    items.sort((a, b) => {
      const dateA = new Date(a.occurred_on).getTime();
      const dateB = new Date(b.occurred_on).getTime();
      if (sort === 'oldest') {
        return dateA - dateB || new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return dateB - dateA || new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const total = items.length;
    const from = (page - 1) * limit;
    const paginated = items.slice(from, from + limit);

    return {
      listings: paginated,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit) || 1
    };
  }

  // ----------------------------------------------------
  // Listing: Fetch by ID
  // ----------------------------------------------------
  async getListingById(id: string, currentUserId?: string): Promise<ListingItem | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('listings')
        .select(
          `
          id, owner_id, type, title, description, category, location_id,
          location_detail, occurred_on, image_path, status, created_at, updated_at,
          campus_locations (name),
          profiles (id, display_name)
        `
        )
        .eq('id', id)
        .single();

      if (!error && data) {
        // Enforce access rule: active listings are public, non-active listings only visible to owner
        if (data.status !== 'active' && data.owner_id !== currentUserId) {
          return null;
        }

        return {
          id: data.id,
          owner_id: data.owner_id,
          type: data.type,
          title: data.title,
          description: data.description,
          category: data.category,
          location_id: data.location_id,
          location_name: (data as any).campus_locations?.name,
          location_detail: data.location_detail,
          occurred_on: data.occurred_on,
          image_path: data.image_path,
          image_url: data.image_path ? this.getImagePublicUrl(data.image_path) : null,
          status: data.status,
          created_at: data.created_at,
          updated_at: data.updated_at,
          owner: (data as any).profiles
            ? { id: (data as any).profiles.id, display_name: (data as any).profiles.display_name }
            : undefined
        };
      }
    }

    const item = memDB.listings.get(id);
    if (!item) return null;
    if (item.status !== 'active' && item.owner_id !== currentUserId) {
      return null;
    }
    return item;
  }

  // ----------------------------------------------------
  // Listing: Create
  // ----------------------------------------------------
  async createListing(
    ownerId: string,
    ownerDisplayName: string,
    input: CreateListingInput
  ): Promise<ListingItem> {
    const location = (await this.getLocations()).find((l) => l.id === input.location_id);
    const locationName = location ? location.name : 'Campus';

    if (isSupabaseConfigured()) {
      // Ensure profile exists first
      await this.ensureProfile(ownerId, ownerDisplayName);

      const newListing = {
        owner_id: ownerId,
        type: input.type,
        title: input.title,
        description: input.description,
        category: input.category,
        location_id: input.location_id,
        location_detail: input.location_detail || null,
        occurred_on: input.occurred_on,
        image_path: input.image_path || null,
        status: 'active'
      };

      const { data, error } = await getSupabaseClient()
        .from('listings')
        .insert(newListing)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create listing: ${error.message}`);
      }

      return {
        id: data.id,
        owner_id: data.owner_id,
        type: data.type,
        title: data.title,
        description: data.description,
        category: data.category,
        location_id: data.location_id,
        location_name: locationName,
        location_detail: data.location_detail,
        occurred_on: data.occurred_on,
        image_path: data.image_path,
        image_url: data.image_path ? this.getImagePublicUrl(data.image_path) : null,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        owner: { id: ownerId, display_name: ownerDisplayName }
      };
    }

    // In-memory fallback
    await this.ensureProfile(ownerId, ownerDisplayName);
    const id = uuidv4();
    const now = new Date().toISOString();
    const item: ListingItem = {
      id,
      owner_id: ownerId,
      type: input.type,
      title: input.title,
      description: input.description,
      category: input.category,
      location_id: input.location_id,
      location_name: locationName,
      location_detail: input.location_detail || null,
      occurred_on: input.occurred_on,
      image_path: input.image_path || null,
      image_url: input.image_path ? this.getImagePublicUrl(input.image_path) : null,
      status: 'active',
      created_at: now,
      updated_at: now,
      owner: { id: ownerId, display_name: ownerDisplayName }
    };
    memDB.listings.set(id, item);
    return item;
  }

  // ----------------------------------------------------
  // Listing: Update (Edit / Status toggle)
  // ----------------------------------------------------
  async updateListing(
    id: string,
    ownerId: string,
    input: UpdateListingInput
  ): Promise<ListingItem | null> {
    const existing = await this.getListingById(id, ownerId);
    if (!existing) return null;
    if (existing.owner_id !== ownerId) {
      throw new Error('Forbidden: You can only edit your own listings');
    }

    let locationName = existing.location_name;
    if (input.location_id && input.location_id !== existing.location_id) {
      const location = (await this.getLocations()).find((l) => l.id === input.location_id);
      if (location) locationName = location.name;
    }

    if (isSupabaseConfigured()) {
      const updates: any = {
        ...input,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await getSupabaseClient()
        .from('listings')
        .update(updates)
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single();

      if (error) throw new Error(`Update failed: ${error.message}`);

      return {
        ...existing,
        ...data,
        location_name: locationName,
        image_url: data.image_path ? this.getImagePublicUrl(data.image_path) : null
      };
    }

    const updated: ListingItem = {
      ...existing,
      ...input,
      location_name: locationName,
      updated_at: new Date().toISOString()
    };
    if (input.image_path !== undefined) {
      updated.image_path = input.image_path;
      updated.image_url = input.image_path ? this.getImagePublicUrl(input.image_path) : null;
    }
    memDB.listings.set(id, updated);
    return updated;
  }

  // ----------------------------------------------------
  // Listing: Delete
  // ----------------------------------------------------
  async deleteListing(id: string, ownerId: string): Promise<boolean> {
    const existing = await this.getListingById(id, ownerId);
    if (!existing) return false;
    if (existing.owner_id !== ownerId) {
      throw new Error('Forbidden: You can only delete your own listings');
    }

    if (isSupabaseConfigured()) {
      const { error } = await getSupabaseClient()
        .from('listings')
        .delete()
        .eq('id', id)
        .eq('owner_id', ownerId);

      if (error) throw new Error(`Delete failed: ${error.message}`);
      return true;
    }

    memDB.listings.delete(id);
    return true;
  }

  // ----------------------------------------------------
  // User Listings (Dashboard)
  // ----------------------------------------------------
  async getUserListings(userId: string): Promise<ListingItem[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('listings')
        .select(
          `
          id, owner_id, type, title, description, category, location_id,
          location_detail, occurred_on, image_path, status, created_at, updated_at,
          campus_locations (name),
          profiles (id, display_name)
        `
        )
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((row: any) => ({
          id: row.id,
          owner_id: row.owner_id,
          type: row.type,
          title: row.title,
          description: row.description,
          category: row.category,
          location_id: row.location_id,
          location_name: row.campus_locations?.name,
          location_detail: row.location_detail,
          occurred_on: row.occurred_on,
          image_path: row.image_path,
          image_url: row.image_path ? this.getImagePublicUrl(row.image_path) : null,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
          owner: row.profiles ? { id: row.profiles.id, display_name: row.profiles.display_name } : undefined
        }));
      }
    }

    return Array.from(memDB.listings.values())
      .filter((l) => l.owner_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // ----------------------------------------------------
  // Contact Requests: Create
  // ----------------------------------------------------
  async createContactRequest(
    listingId: string,
    senderId: string,
    senderDisplayName: string,
    input: CreateContactRequestInput
  ): Promise<ContactRequestItem> {
    const listing = await this.getListingById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }
    if (listing.status !== 'active') {
      throw new Error('Contact requests can only be sent for active listings');
    }
    if (listing.owner_id === senderId) {
      throw new Error('You cannot send a contact request to your own listing');
    }

    // Check duplicate pending requests
    const userRequests = await this.getUserContactRequests(senderId);
    const duplicate = userRequests.sent.find(
      (r) => r.listing_id === listingId && r.status === 'pending'
    );
    if (duplicate) {
      throw new Error('You already have a pending contact request for this listing');
    }

    if (isSupabaseConfigured()) {
      await this.ensureProfile(senderId, senderDisplayName);

      const newRequest = {
        listing_id: listingId,
        sender_id: senderId,
        message: input.message,
        reply_preference: input.reply_preference,
        status: 'pending'
      };

      const { data, error } = await getSupabaseClient()
        .from('contact_requests')
        .insert(newRequest)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to submit contact request: ${error.message}`);
      }

      return {
        id: data.id,
        listing_id: data.listing_id,
        sender_id: data.sender_id,
        message: data.message,
        reply_preference: data.reply_preference,
        status: data.status,
        owner_response: data.owner_response,
        responded_at: data.responded_at,
        created_at: data.created_at,
        listing: {
          id: listing.id,
          title: listing.title,
          type: listing.type,
          category: listing.category,
          status: listing.status,
          owner_id: listing.owner_id
        },
        sender: { id: senderId, display_name: senderDisplayName }
      };
    }

    // In-memory fallback
    await this.ensureProfile(senderId, senderDisplayName);
    const id = uuidv4();
    const now = new Date().toISOString();
    const reqItem: ContactRequestItem = {
      id,
      listing_id: listingId,
      sender_id: senderId,
      message: input.message,
      reply_preference: input.reply_preference,
      status: 'pending',
      owner_response: null,
      responded_at: null,
      created_at: now,
      listing: {
        id: listing.id,
        title: listing.title,
        type: listing.type,
        category: listing.category,
        status: listing.status,
        owner_id: listing.owner_id
      },
      sender: { id: senderId, display_name: senderDisplayName }
    };
    memDB.contactRequests.set(id, reqItem);
    return reqItem;
  }

  // ----------------------------------------------------
  // Contact Requests: Get User Requests (Received & Sent)
  // ----------------------------------------------------
  async getUserContactRequests(userId: string): Promise<{
    received: ContactRequestItem[];
    sent: ContactRequestItem[];
  }> {
    if (isSupabaseConfigured()) {
      // 1. Sent requests
      const { data: sentData } = await getSupabaseClient()
        .from('contact_requests')
        .select(
          `
          id, listing_id, sender_id, message, reply_preference, status, owner_response, responded_at, created_at,
          listings (id, title, type, category, status, owner_id)
        `
        )
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });

      // 2. Received requests (requests for user's listings)
      const userListings = await this.getUserListings(userId);
      const listingIds = userListings.map((l) => l.id);

      let receivedData: any[] = [];
      if (listingIds.length > 0) {
        const { data } = await getSupabaseClient()
          .from('contact_requests')
          .select(
            `
            id, listing_id, sender_id, message, reply_preference, status, owner_response, responded_at, created_at,
            listings (id, title, type, category, status, owner_id),
            profiles (id, display_name)
          `
          )
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false });

        if (data) receivedData = data;
      }

      const formatRequest = (row: any): ContactRequestItem => ({
        id: row.id,
        listing_id: row.listing_id,
        sender_id: row.sender_id,
        message: row.message,
        reply_preference: row.reply_preference,
        status: row.status,
        owner_response: row.owner_response,
        responded_at: row.responded_at,
        created_at: row.created_at,
        listing: row.listings
          ? {
              id: row.listings.id,
              title: row.listings.title,
              type: row.listings.type,
              category: row.listings.category,
              status: row.listings.status,
              owner_id: row.listings.owner_id
            }
          : undefined,
        sender: row.profiles
          ? { id: row.profiles.id, display_name: row.profiles.display_name }
          : undefined
      });

      return {
        sent: (sentData || []).map(formatRequest),
        received: receivedData.map(formatRequest)
      };
    }

    // In-memory fallback
    const all = Array.from(memDB.contactRequests.values());
    const sent = all
      .filter((r) => r.sender_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const received = all
      .filter((r) => {
        const listing = memDB.listings.get(r.listing_id);
        return listing && listing.owner_id === userId;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { sent, received };
  }

  // ----------------------------------------------------
  // Contact Request: Fetch by ID
  // ----------------------------------------------------
  async getContactRequestById(id: string, userId: string): Promise<ContactRequestItem | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('contact_requests')
        .select(
          `
          id, listing_id, sender_id, message, reply_preference, status, owner_response, responded_at, created_at,
          listings (id, title, type, category, status, owner_id),
          profiles (id, display_name)
        `
        )
        .eq('id', id)
        .single();

      if (!error && data) {
        const listingOwnerId = (data.listings as any)?.owner_id;
        // Verify authorization: only sender or listing owner can view
        if (data.sender_id !== userId && listingOwnerId !== userId) {
          return null;
        }

        return {
          id: data.id,
          listing_id: data.listing_id,
          sender_id: data.sender_id,
          message: data.message,
          reply_preference: data.reply_preference,
          status: data.status,
          owner_response: data.owner_response,
          responded_at: data.responded_at,
          created_at: data.created_at,
          listing: data.listings
            ? {
                id: (data.listings as any).id,
                title: (data.listings as any).title,
                type: (data.listings as any).type,
                category: (data.listings as any).category,
                status: (data.listings as any).status,
                owner_id: (data.listings as any).owner_id
              }
            : undefined,
          sender: data.profiles
            ? { id: (data.profiles as any).id, display_name: (data.profiles as any).display_name }
            : undefined
        };
      }
    }

    const item = memDB.contactRequests.get(id);
    if (!item) return null;
    const listing = memDB.listings.get(item.listing_id);
    if (item.sender_id !== userId && (!listing || listing.owner_id !== userId)) {
      return null;
    }
    return item;
  }

  // ----------------------------------------------------
  // Contact Request: Respond or Close
  // ----------------------------------------------------
  async respondContactRequest(
    id: string,
    ownerId: string,
    input: RespondContactRequestInput
  ): Promise<ContactRequestItem | null> {
    const existing = await this.getContactRequestById(id, ownerId);
    if (!existing) return null;
    if (existing.listing?.owner_id !== ownerId) {
      throw new Error('Forbidden: Only the listing owner can respond to this contact request');
    }

    const now = new Date().toISOString();
    const newStatus = input.status || 'responded';

    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .from('contact_requests')
        .update({
          owner_response: input.owner_response,
          status: newStatus,
          responded_at: now
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Response failed: ${error.message}`);

      return {
        ...existing,
        owner_response: data.owner_response,
        status: data.status,
        responded_at: data.responded_at
      };
    }

    const updated: ContactRequestItem = {
      ...existing,
      owner_response: input.owner_response,
      status: newStatus,
      responded_at: now
    };
    memDB.contactRequests.set(id, updated);
    return updated;
  }

  // ----------------------------------------------------
  // Storage: Upload Image
  // ----------------------------------------------------
  async uploadListingImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ path: string; publicUrl: string }> {
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    const storagePath = `listings/${filename}`;

    if (isSupabaseConfigured()) {
      const { data, error } = await getSupabaseClient()
        .storage.from('listing-images')
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: false
        });

      if (error) {
        throw new Error(`Storage upload failed: ${error.message}`);
      }

      const publicUrl = this.getImagePublicUrl(data.path);
      return { path: data.path, publicUrl };
    }

    // In-memory / data URL fallback for local development
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return {
      path: storagePath,
      publicUrl: dataUrl
    };
  }

  private getImagePublicUrl(path: string): string {
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    if (isSupabaseConfigured()) {
      const { data } = getSupabaseClient().storage.from('listing-images').getPublicUrl(path);
      return data.publicUrl;
    }
    return `/api/v1/storage/${path}`;
  }
}

export const dbService = new DatabaseService();
