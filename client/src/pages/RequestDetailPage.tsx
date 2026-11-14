import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ContactRequestItem } from '@campus/shared';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  ArrowLeft,
  User,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Loader2
} from 'lucide-react';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [request, setRequest] = useState<ContactRequestItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ownerReply, setOwnerReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const loadRequest = () => {
    if (!id || !token) return;
    setLoading(true);
    api
      .getContactRequest(id, token)
      .then((data) => {
        setRequest(data);
        if (data.owner_response) {
          setOwnerReply(data.owner_response);
        }
      })
      .catch((err) => {
        setError(err.message || 'Could not load inquiry details or access is unauthorized.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequest();
  }, [id, token]);

  const handleRespond = async (status: 'responded' | 'closed') => {
    if (!id || !token) return;
    setReplyError(null);

    const trimmed = ownerReply.trim();
    if (!trimmed) {
      setReplyError('Please write a reply message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.respondContactRequest(
        id,
        {
          owner_response: trimmed,
          status
        },
        token
      );
      success(
        status === 'responded' ? 'Reply Sent!' : 'Inquiry Closed',
        'Your response has been saved.'
      );
      loadRequest();
    } catch (err: any) {
      toastError('Could not send reply', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading inquiry thread..." className="py-32" />;
  }

  if (error || !request) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorState
          title="Inquiry Not Available"
          message={error || 'This inquiry does not exist or you do not have permission to view it.'}
          onRetry={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  const isOwner = Boolean(user && request.listing?.owner_id === user.id);
  const isSender = Boolean(user && request.sender_id === user.id);
  const formattedDate = new Date(request.created_at).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Conversation Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Listing Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Referencing Item
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {request.listing?.title || 'Campus Item'}
            </h1>
          </div>

          {request.listing && (
            <Link
              to={`/listings/${request.listing.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 rounded-xl shadow-sm transition-colors"
            >
              <span>View Full Listing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Message Thread */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status info bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  request.status === 'responded'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {request.status === 'responded' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
                <span className="capitalize">{request.status}</span>
              </span>

              <span className="text-xs text-slate-400">
                Via {request.reply_preference === 'in_app' ? 'In-App Message' : 'Email Relay'}
              </span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Original Message */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <User className="w-4 h-4 text-indigo-600" />
              <span>
                {request.sender?.display_name || 'Campus Student'}{' '}
                {isSender && <span className="font-normal text-slate-400">(You)</span>}
              </span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              {request.message}
            </div>
          </div>

          {/* Existing Response (if already responded) */}
          {request.owner_response && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Poster Response{' '}
                    {isOwner && <span className="font-normal text-slate-400">(You)</span>}
                  </span>
                </div>
                {request.responded_at && (
                  <span className="text-slate-400 font-normal">
                    {new Date(request.responded_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-sm text-emerald-950 whitespace-pre-wrap leading-relaxed">
                {request.owner_response}
              </div>
            </div>
          )}

          {/* Reply Form for Listing Owner */}
          {isOwner && (
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                {request.owner_response ? 'Update Your Reply' : 'Send Reply to Student'}
              </h3>
              <p className="text-xs text-slate-500">
                Arrange a safe public campus location (e.g. Student Center help desk) and confirm
                details to verify ownership.
              </p>

              <div>
                <textarea
                  rows={4}
                  value={ownerReply}
                  onChange={(e) => setOwnerReply(e.target.value)}
                  placeholder="e.g., Hi Alex, thanks for messaging! I'll be at the Library 1st floor desk from 2-4 PM today..."
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                {replyError && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {replyError}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleRespond('responded')}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {request.owner_response ? 'Update Reply' : 'Send Response'}
                </button>

                <button
                  type="button"
                  onClick={() => handleRespond('closed')}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
                >
                  Mark Closed
                </button>
              </div>
            </div>
          )}

          {/* Sender waiting notice */}
          {isSender && !request.owner_response && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p>
                The listing owner has received your contact request. When they respond, you will see
                their reply here and in your dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
