import React from 'react';
import { Link } from 'react-router-dom';
import { ContactRequestItem } from '@campus/shared';
import { Calendar, User, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface ContactRequestCardProps {
  request: ContactRequestItem;
  mode: 'received' | 'sent';
}

export const ContactRequestCard: React.FC<ContactRequestCardProps> = ({ request, mode }) => {
  const isResponded = request.status === 'responded';
  const formattedDate = new Date(request.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status pill */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isResponded
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isResponded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {isResponded ? 'Responded' : 'Pending Response'}
          </span>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        {/* Listing Title */}
        <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
          {request.listing?.title || 'Campus Item'}
        </h4>

        {/* Sender Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {mode === 'received'
              ? `From: ${request.sender?.display_name || 'Campus Student'}`
              : `You contacted the poster`}
          </span>
        </div>

        {/* Message snippet */}
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic line-clamp-2 mb-3 leading-relaxed">
          "{request.message}"
        </p>

        {/* Owner response snippet if exists */}
        {request.owner_response && (
          <div className="text-xs bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-emerald-900 mb-3">
            <span className="font-semibold block text-[11px] uppercase tracking-wider text-emerald-700 mb-0.5">
              Poster Reply:
            </span>
            <p className="italic line-clamp-2">"{request.owner_response}"</p>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Via {request.reply_preference === 'in_app' ? 'In-App Message' : 'Email Relay'}
        </span>

        <Link
          to={`/dashboard/requests/${request.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>{mode === 'received' ? 'View & Reply' : 'View Thread'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
