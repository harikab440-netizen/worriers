import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ListingItem,
  CampusLocation,
  ListingType,
  ItemCategory,
  SortOption
} from '@campus/shared';
import { api } from '../api/client';
import { SearchBar } from '../components/listings/SearchBar';
import { ListingFilters, FilterState } from '../components/listings/ListingFilters';
import { ListingGrid } from '../components/listings/ListingGrid';
import { Pagination } from '../components/common/Pagination';
import { PlusCircle, Compass, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalListings, setTotalListings] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Extract filters from URL query params
  const q = searchParams.get('q') || '';
  const type = (searchParams.get('type') as ListingType) || undefined;
  const category = (searchParams.get('category') as ItemCategory) || undefined;
  const location_id = searchParams.get('location_id') || undefined;
  const start_date = searchParams.get('start_date') || undefined;
  const end_date = searchParams.get('end_date') || undefined;
  const sort = (searchParams.get('sort') as SortOption) || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Load campus locations once
  useEffect(() => {
    api
      .getLocations()
      .then((data) => setLocations(data))
      .catch((err) => console.error('Failed to load locations', err));
  }, []);

  // Fetch listings on filter change
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getListings({
        q,
        type,
        category,
        location_id,
        start_date,
        end_date,
        sort,
        page,
        limit: 12
      });
      setListings(res.listings);
      setTotalListings(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error('Failed to fetch listings', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [q, type, category, location_id, start_date, end_date, sort, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Helper to update query parameters in URL
  const updateParams = (updates: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        nextParams.set(key, val);
      } else {
        nextParams.delete(key);
      }
    });
    // Reset to page 1 on filter changes if page was not explicitly passed
    if (!('page' in updates)) {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handleFilterChange = (updated: Partial<FilterState>) => {
    const serialized: Record<string, string | undefined> = {};
    if ('type' in updated) serialized.type = updated.type;
    if ('category' in updated) serialized.category = updated.category;
    if ('location_id' in updated) serialized.location_id = updated.location_id;
    if ('start_date' in updated) serialized.start_date = updated.start_date;
    if ('end_date' in updated) serialized.end_date = updated.end_date;
    if ('sort' in updated) serialized.sort = updated.sort;
    updateParams(serialized);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const currentFilters: FilterState = {
    type,
    category,
    location_id,
    start_date,
    end_date,
    sort
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Campus Lost & Found Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Recover lost items. Return found belongings safely.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-xl">
            Search active campus reports, filter by building or category, and contact posters
            confidentially without exposing your private contact details.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/listings/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-900 bg-white hover:bg-indigo-50 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              Report Lost or Found Item
            </Link>
          </div>
        </div>

        {/* Abstract decorative graphic */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <Compass className="w-96 h-96" />
        </div>
      </div>

      {/* Search Input */}
      <div>
        <SearchBar
          value={q}
          onChange={(val) => updateParams({ q: val })}
          onSubmit={fetchListings}
        />
      </div>

      {/* Filter Toolbar */}
      <ListingFilters
        filters={currentFilters}
        locations={locations}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            Active Campus Listings{' '}
            {!loading && <span className="text-slate-400 font-normal">({totalListings})</span>}
          </h2>
        </div>

        <ListingGrid
          listings={listings}
          loading={loading}
          emptyTitle="No matching campus items"
          emptyDescription="We couldn't find any active listings matching your current filter criteria."
          emptyAction={
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Clear all filters
            </button>
          }
        />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalListings}
          limit={12}
          onPageChange={(newPage) => updateParams({ page: String(newPage) })}
        />
      </div>
    </div>
  );
};
