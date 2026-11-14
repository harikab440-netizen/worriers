import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CampusLocation, CreateListingInput } from '@campus/shared';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ListingForm } from '../components/listings/ListingForm';
import { LoadingState } from '../components/common/LoadingState';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const CreateListingPage: React.FC = () => {
  const { token } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .getLocations()
      .then((data) => setLocations(data))
      .catch((err) => console.error('Failed to load locations', err))
      .finally(() => setLoadingLocations(false));
  }, []);

  const handleSubmit = async (formData: CreateListingInput) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const created = await api.createListing(formData, token);
      success('Listing Published!', 'Your campus item report has been published successfully.');
      navigate(`/listings/${created.id}`);
    } catch (err: any) {
      toastError('Failed to create listing', err.message || 'Please check the form and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingLocations) {
    return <LoadingState message="Loading campus locations..." className="py-32" />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Campus Item Report</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Post a Lost or Found Item</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide descriptive details to assist fellow students in identifying and claiming their
            property.
          </p>
        </div>

        <ListingForm
          locations={locations}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
