import React from 'react';
import { ListingType } from '@campus/shared';
import { HelpCircle, CheckCircle } from 'lucide-react';

interface ListingTypeBadgeProps {
  type: ListingType;
  className?: string;
}

export const ListingTypeBadge: React.FC<ListingTypeBadgeProps> = ({ type, className = '' }) => {
  const isLost = type === 'lost';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
        isLost
          ? 'bg-rose-50 text-rose-700 border border-rose-200'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      } ${className}`}
    >
      {isLost ? <HelpCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
      {isLost ? 'Lost Item' : 'Found Item'}
    </span>
  );
};
