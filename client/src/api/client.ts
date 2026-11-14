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
  SuggestCategoryResponse,
  ImproveDescriptionResponse
} from '@campus/shared';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data as T;
}

export const api = {
  // Campus Locations
  getLocations: (): Promise<CampusLocation[]> => request<CampusLocation[]>('/locations'),

  // Listings
  getListings: (params: Partial<ListingQueryParams> = {}): Promise<PaginatedListings> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return request<PaginatedListings>(`/listings${queryString ? `?${queryString}` : ''}`);
  },

  getListing: (id: string, token?: string | null): Promise<ListingItem> =>
    request<ListingItem>(`/listings/${id}`, {}, token),

  createListing: (data: CreateListingInput, token: string): Promise<ListingItem> =>
    request<ListingItem>(
      '/listings',
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      token
    ),

  updateListing: (id: string, data: UpdateListingInput, token: string): Promise<ListingItem> =>
    request<ListingItem>(
      `/listings/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      },
      token
    ),

  deleteListing: (id: string, token: string): Promise<{ message: string }> =>
    request<{ message: string }>(
      `/listings/${id}`,
      {
        method: 'DELETE'
      },
      token
    ),

  // Contact Requests
  createContactRequest: (
    listingId: string,
    data: CreateContactRequestInput,
    token: string
  ): Promise<ContactRequestItem> =>
    request<ContactRequestItem>(
      `/listings/${listingId}/contact-requests`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      token
    ),

  getUserListings: (token: string): Promise<ListingItem[]> =>
    request<ListingItem[]>('/me/listings', {}, token),

  getUserContactRequests: (
    token: string
  ): Promise<{ received: ContactRequestItem[]; sent: ContactRequestItem[] }> =>
    request<{ received: ContactRequestItem[]; sent: ContactRequestItem[] }>(
      '/me/contact-requests',
      {},
      token
    ),

  getContactRequest: (id: string, token: string): Promise<ContactRequestItem> =>
    request<ContactRequestItem>(`/contact-requests/${id}`, {}, token),

  respondContactRequest: (
    id: string,
    data: RespondContactRequestInput,
    token: string
  ): Promise<ContactRequestItem> =>
    request<ContactRequestItem>(
      `/contact-requests/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      },
      token
    ),

  // Upload image
  uploadImage: async (
    file: File,
    token: string
  ): Promise<{ path: string; publicUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    return request<{ path: string; publicUrl: string }>(
      '/upload/image',
      {
        method: 'POST',
        body: formData
      },
      token
    );
  },

  // AI Assistance
  suggestCategory: (
    title: string,
    description: string,
    token: string
  ): Promise<SuggestCategoryResponse> =>
    request<SuggestCategoryResponse>(
      '/ai/suggest-category',
      {
        method: 'POST',
        body: JSON.stringify({ title, description })
      },
      token
    ),

  improveDescription: (
    description: string,
    token: string
  ): Promise<ImproveDescriptionResponse> =>
    request<ImproveDescriptionResponse>(
      '/ai/improve-description',
      {
        method: 'POST',
        body: JSON.stringify({ description })
      },
      token
    )
};
