import React from 'react';
import { ListingStatus } from '@campus/shared';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface ListingStatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

export const ListingStatusBadge: React.FC<ListingStatusBadgeProps> = ({ status, className = '' }) => {
  if (status === 'returned') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3" />
        Returned
      </span>
    );
  }

  if (status === 'closed') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 ${className}`}
      >
        <XCircle className="w-3 h-3" />
        Closed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
    >
      <Clock className="w-3 h-3" />
      Active
    </span>
  );
};
