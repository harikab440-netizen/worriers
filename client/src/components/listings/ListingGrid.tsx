import React from 'react';
import { ListingItem } from '@campus/shared';
import { ListingCard } from './ListingCard';
import { LoadingState } from '../common/LoadingState';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

interface ListingGridProps {
  listings: ListingItem[];
  loading: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
  listings,
  loading,
  emptyTitle = 'No campus listings found',
  emptyDescription = 'Try adjusting your search keywords, clearing filters, or checking back later.',
  emptyAction
}) => {
  if (loading) {
    return <LoadingState message="Loading campus listings..." className="py-24" />;
  }

  if (listings.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Search className="w-7 h-7" />}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};
