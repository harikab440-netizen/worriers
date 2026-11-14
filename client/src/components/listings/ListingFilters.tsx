import React from 'react';
import {
  ITEM_CATEGORIES,
  CampusLocation,
  ListingType,
  ItemCategory,
  SortOption
} from '@campus/shared';
import { Filter, RotateCcw, Calendar, MapPin, Tag, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  type?: ListingType;
  category?: ItemCategory;
  location_id?: string;
  start_date?: string;
  end_date?: string;
  sort: SortOption;
}

interface ListingFiltersProps {
  filters: FilterState;
  locations: CampusLocation[];
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  filters,
  locations,
  onChange,
  onReset
}) => {
  const hasActiveFilters = Boolean(
    filters.type ||
    filters.category ||
    filters.location_id ||
    filters.start_date ||
    filters.end_date ||
    filters.sort !== 'newest'
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter & Sort Listings</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Listing Type Quick Pills */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">Listing Type</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChange({ type: undefined })}
            className={`py-2 px-3 text-xs font-medium rounded-xl transition-all ${
              !filters.type
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'lost' })}
            className={`py-2 px-3 text-xs font-medium rounded-xl transition-all ${
              filters.type === 'lost'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Lost
          </button>
          <button
            type="button"
            onClick={() => onChange({ type: 'found' })}
            className={`py-2 px-3 text-xs font-medium rounded-xl transition-all ${
              filters.type === 'found'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Found
          </button>
        </div>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            <Tag className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onChange({ category: (e.target.value as ItemCategory) || undefined })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Campus Location
          </label>
          <select
            value={filters.location_id || ''}
            onChange={(e) => onChange({ location_id: e.target.value || undefined })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Occurred Since
          </label>
          <input
            type="date"
            value={filters.start_date || ''}
            onChange={(e) => onChange({ start_date: e.target.value || undefined })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
            Sort Order
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="newest">Newest Date First</option>
            <option value="oldest">Oldest Date First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
