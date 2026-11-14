import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
  User,
  ArrowLeft,
  Edit3,
  Shield,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { ListingItem, ReplyPreference } from '@campus/shared';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ListingTypeBadge } from '../components/listings/ListingTypeBadge';
import { ListingStatusBadge } from '../components/listings/ListingStatusBadge';
import { ContactRequestForm } from '../components/contact/ContactRequestForm';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .getListing(id, token)
      .then((data) => setListing(data))
      .catch((err) => {
        setError(err.message || 'Listing could not be found or has been closed.');
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleContactSubmit = async (data: {
    message: string;
    reply_preference: ReplyPreference;
  }) => {
    if (!token || !id) return;
    setSubmittingContact(true);
    try {
      await api.createContactRequest(id, data, token);
      success(
        'Request Sent!',
        'Your contact request has been delivered to the poster. Check your Dashboard for updates.'
      );
      setContactSubmitted(true);
    } catch (err: any) {
      toastError('Could not send request', err.message || 'Failed to submit contact request.');
    } finally {
      setSubmittingContact(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading item details..." className="py-32" />;
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorState
          title="Listing Not Found"
          message={error || 'This listing does not exist or is no longer available.'}
          onRetry={() => navigate('/')}
        />
        <div className="text-center mt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Listings
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = Boolean(user && user.id === listing.owner_id);
  const formattedDate = new Date(listing.occurred_on).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>

        {isOwner && (
          <Link
            to={`/listings/${listing.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-400 text-sm font-semibold text-slate-700 hover:text-indigo-600 rounded-xl shadow-sm transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Edit Listing
          </Link>
        )}
      </div>

      {/* Main Listing Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Photo / Visual Container */}
          <div className="bg-slate-100 flex items-center justify-center min-h-[320px] md:min-h-[440px] relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-200">
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-full object-cover max-h-[500px]"
              />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <Tag className="w-16 h-16 mx-auto mb-2 stroke-1 text-slate-300" />
                <p className="text-sm font-medium">No photo provided for this item</p>
                <p className="text-xs text-slate-400 mt-1">
                  Refer to the detailed description below
                </p>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <ListingTypeBadge type={listing.type} />
            </div>

            {listing.status !== 'active' && (
              <div className="absolute top-4 right-4">
                <ListingStatusBadge status={listing.status} />
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category */}
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>{listing.category}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-slate-900 leading-snug">{listing.title}</h1>

              {/* Status banner if inactive */}
              {listing.status !== 'active' && (
                <div className="mt-3 p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>This item has been marked as {listing.status}.</span>
                </div>
              )}

              {/* Key metadata grid */}
              <div className="mt-6 space-y-3 pt-6 border-t border-slate-100 text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">
                      {listing.location_name || 'Campus Building'}
                    </span>
                    {listing.location_detail && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        Specifics: {listing.location_detail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div>
                    <span className="text-slate-500">Date {listing.type}: </span>
                    <span className="font-medium text-slate-800">{formattedDate}</span>
                  </div>
                </div>

                {listing.owner && (
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <div>
                      <span className="text-slate-500">Posted by: </span>
                      <span className="font-medium text-slate-800">
                        {listing.owner.display_name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Item Description
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Poster contact details remain confidential until mutually agreed.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isOwner ? 'Your Listing' : 'Contact the Poster'}
            </h2>
            <p className="text-xs text-slate-500">
              {isOwner
                ? 'Check your dashboard to view any incoming messages for this item.'
                : 'Send a confidential message to coordinate verification and return.'}
            </p>
          </div>
        </div>

        {contactSubmitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-semibold text-emerald-900">
              Contact Request Submitted!
            </h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Your inquiry has been routed to {listing.owner?.display_name || 'the poster'}. You can
              track this request and view responses in your{' '}
              <Link to="/dashboard" className="font-bold underline">
                Dashboard
              </Link>
              .
            </p>
          </div>
        ) : !user ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
            <p className="text-sm text-slate-700 font-medium">
              You must be signed in with a campus account to contact the poster.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/login"
                state={{ from: window.location.pathname }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
              >
                Sign In to Contact
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-100 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <ContactRequestForm
            listingTitle={listing.title}
            isOwner={isOwner}
            onSubmit={handleContactSubmit}
            isSubmitting={submittingContact}
          />
        )}
      </div>
    </div>
  );
};
