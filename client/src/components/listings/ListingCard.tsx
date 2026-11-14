import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, User } from 'lucide-react';
import { ListingItem } from '@campus/shared';
import { ListingTypeBadge } from './ListingTypeBadge';
import { ListingStatusBadge } from './ListingStatusBadge';

interface ListingCardProps {
  listing: ListingItem;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const formattedDate = new Date(listing.occurred_on).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {/* Image or Placeholder Area */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
            <Tag className="w-10 h-10 mb-1 stroke-1" />
            <span className="text-xs font-medium text-slate-400">No photo provided</span>
          </div>
        )}

        {/* Type Badge in Top Left */}
        <div className="absolute top-3 left-3">
          <ListingTypeBadge type={listing.type} />
        </div>

        {/* Status Badge in Top Right if not active */}
        {listing.status !== 'active' && (
          <div className="absolute top-3 right-3">
            <ListingStatusBadge status={listing.status} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>{listing.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
            {listing.title}
          </h3>

          {/* Description Preview */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {listing.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{listing.location_name || 'Campus Location'}</span>
            {listing.location_detail && (
              <span className="text-slate-400 truncate">({listing.location_detail})</span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
            {listing.owner && (
              <div className="flex items-center gap-1 truncate max-w-[120px]">
                <User className="w-3 h-3 text-slate-400" />
                <span className="truncate">{listing.owner.display_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
