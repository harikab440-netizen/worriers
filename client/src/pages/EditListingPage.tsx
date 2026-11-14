import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CampusLocation, ListingItem, UpdateListingInput } from '@campus/shared';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ListingForm } from '../components/listings/ListingForm';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ArrowLeft, Trash2 } from 'lucide-react';

export const EditListingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [listing, setListing] = useState<ListingItem | null>(null);
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    setLoading(true);

    Promise.all([api.getListing(id, token), api.getLocations()])
      .then(([listingData, locationsData]) => {
        if (user && listingData.owner_id !== user.id) {
          setError('You do not have permission to edit this listing.');
        } else {
          setListing(listingData);
          setLocations(locationsData);
        }
      })
      .catch((err) => {
        setError(err.message || 'Could not load listing for editing.');
      })
      .finally(() => setLoading(false));
  }, [id, token, user]);

  const handleUpdate = async (formData: UpdateListingInput) => {
    if (!token || !id) return;
    setIsSubmitting(true);
    try {
      await api.updateListing(id, formData, token);
      success('Listing Updated', 'Your changes have been saved.');
      navigate(`/listings/${id}`);
    } catch (err: any) {
      toastError('Update Failed', err.message || 'Could not save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !id) return;
    setIsDeleting(true);
    try {
      await api.deleteListing(id, token);
      success('Listing Deleted', 'The listing has been permanently removed.');
      navigate('/dashboard');
    } catch (err: any) {
      toastError('Delete Failed', err.message || 'Could not delete listing.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading listing details..." className="py-32" />;
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <ErrorState
          title="Access Denied or Not Found"
          message={error || 'Listing not available.'}
          onRetry={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <Link
          to={`/listings/${listing.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel & View Listing
        </Link>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Listing
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold text-slate-900">Edit Campus Listing</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update description, change status to 'Returned', or replace the photo.
          </p>
        </div>

        <ListingForm
          initialListing={listing}
          locations={locations}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          isEditing={true}
        />
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete this listing?"
        message="Are you sure you want to permanently delete this listing? All associated contact requests will also be removed."
        confirmLabel="Yes, Delete Listing"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
