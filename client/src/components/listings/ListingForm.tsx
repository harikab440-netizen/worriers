import React, { useState } from 'react';
import {
  ITEM_CATEGORIES,
  ListingType,
  ItemCategory,
  ReplyPreference,
  ListingStatus,
  CampusLocation,
  ListingItem
} from '@campus/shared';
import { ImageUploader } from './ImageUploader';
import { AIWritingAssist } from './AIWritingAssist';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ListingFormProps {
  initialListing?: ListingItem;
  locations: CampusLocation[];
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  isEditing?: boolean;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialListing,
  locations,
  onSubmit,
  isSubmitting,
  isEditing = false
}) => {
  const { token } = useAuth();
  const { error: toastError } = useToast();

  const [type, setType] = useState<ListingType>(initialListing?.type || 'lost');
  const [title, setTitle] = useState(initialListing?.title || '');
  const [description, setDescription] = useState(initialListing?.description || '');
  const [category, setCategory] = useState<ItemCategory>(
    initialListing?.category || ITEM_CATEGORIES[0]
  );
  const [locationId, setLocationId] = useState(
    initialListing?.location_id || (locations[0]?.id ?? '')
  );
  const [locationDetail, setLocationDetail] = useState(initialListing?.location_detail || '');
  const [occurredOn, setOccurredOn] = useState(
    initialListing?.occurred_on || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<ListingStatus>(initialListing?.status || 'active');
  const [contactPreference, setContactPreference] = useState<ReplyPreference>('in_app');
  const [consent, setConsent] = useState(isEditing ? true : false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(initialListing?.image_path || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!type) newErrors.type = 'Please select lost or found';
    if (!title.trim() || title.trim().length < 5 || title.trim().length > 100) {
      newErrors.title = 'Title must be between 5 and 100 characters';
    }
    if (
      !description.trim() ||
      description.trim().length < 20 ||
      description.trim().length > 2000
    ) {
      newErrors.description = 'Description must be between 20 and 2,000 characters';
    }
    if (!category) newErrors.category = 'Please select a category';
    if (!locationId) newErrors.location_id = 'Please select a campus location';
    if (locationDetail && locationDetail.trim().length > 120) {
      newErrors.location_detail = 'Location detail cannot exceed 120 characters';
    }
    if (!occurredOn) {
      newErrors.occurred_on = 'Please provide the date';
    } else {
      const inputDate = new Date(occurredOn);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 1);
      maxDate.setHours(23, 59, 59, 999);
      if (isNaN(inputDate.getTime()) || inputDate > maxDate) {
        newErrors.occurred_on = 'Date cannot be more than 1 day in the future';
      }
    }

    if (!isEditing && !consent) {
      newErrors.consent = 'You must confirm permission and campus visibility';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalImagePath = imagePath;

    // Handle image upload if a new file was chosen
    if (selectedFile && token) {
      setUploadingImage(true);
      try {
        const uploadRes = await api.uploadImage(selectedFile, token);
        finalImagePath = uploadRes.path;
      } catch (err: any) {
        toastError('Image Upload Failed', err.message || 'Could not upload image.');
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    const payload: any = {
      type,
      title: title.trim(),
      description: description.trim(),
      category,
      location_id: locationId,
      location_detail: locationDetail.trim() ? locationDetail.trim() : null,
      occurred_on: occurredOn,
      image_path: finalImagePath,
      contact_preference: contactPreference,
      consent: true
    };

    if (isEditing) {
      payload.status = status;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type Selector Tabs */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          What are you reporting? <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => setType('lost')}
            className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all ${
              type === 'lost'
                ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            I Lost an Item
          </button>
          <button
            type="button"
            onClick={() => setType('found')}
            className={`py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all ${
              type === 'found'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            I Found an Item
          </button>
        </div>
      </div>

      {/* Editing Status Selector */}
      {isEditing && (
        <div className="p-4 bg-slate-100 rounded-2xl">
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            Listing Status
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Change status once an item has been returned or resolved.
          </p>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ListingStatus)}
            className="w-full sm:w-64 text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-medium"
          >
            <option value="active">Active (Visible to Campus)</option>
            <option value="returned">Returned (Resolved)</option>
            <option value="closed">Closed / Cancelled</option>
          </select>
        </div>
      )}

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="title" className="block text-sm font-semibold text-slate-800">
            Item Title <span className="text-rose-500">*</span>
          </label>
          <span
            className={`text-xs ${
              title.length > 100
                ? 'text-rose-500 font-semibold'
                : title.length >= 5
                ? 'text-slate-400'
                : 'text-amber-500'
            }`}
          >
            {title.length}/100 chars (min 5)
          </span>
        </div>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Hydro Flask 32oz (Pacific Blue with stickers)"
          className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 transition-all ${
            errors.title
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {errors.title && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Category & Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ItemCategory)}
            className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Campus Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            Campus Location <span className="text-rose-500">*</span>
          </label>
          <select
            id="location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {errors.location_id && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.location_id}
            </p>
          )}
        </div>
      </div>

      {/* Location Detail & Occurred Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Location Detail */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="locationDetail"
              className="block text-sm font-semibold text-slate-800"
            >
              Location Detail <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <span className="text-xs text-slate-400">{locationDetail.length}/120</span>
          </div>
          <input
            id="locationDetail"
            type="text"
            value={locationDetail}
            onChange={(e) => setLocationDetail(e.target.value)}
            placeholder="e.g., 2nd floor study table near elevator"
            className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Do not publish sensitive dorm room codes or personal access numbers.
          </p>
          {errors.location_detail && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.location_detail}
            </p>
          )}
        </div>

        {/* Date Occurred On */}
        <div>
          <label
            htmlFor="occurredOn"
            className="block text-sm font-semibold text-slate-800 mb-1.5"
          >
            Date {type === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
          </label>
          <input
            id="occurredOn"
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 ${
              errors.occurred_on
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {errors.occurred_on && (
            <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.occurred_on}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-800"
          >
            Item Description <span className="text-rose-500">*</span>
          </label>
          <span
            className={`text-xs ${
              description.length > 2000
                ? 'text-rose-500 font-semibold'
                : description.length >= 20
                ? 'text-slate-400'
                : 'text-amber-500'
            }`}
          >
            {description.length}/2000 chars (min 20)
          </span>
        </div>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe distinctive marks, colors, brand, contents, condition, or circumstances..."
          className={`w-full px-4 py-3 text-sm bg-white border rounded-xl focus:ring-2 transition-all ${
            errors.description
              ? 'border-rose-400 focus:ring-rose-200'
              : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
          }`}
        />
        {errors.description && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.description}
          </p>
        )}
      </div>

      {/* AI Writing & Category Assistant */}
      <AIWritingAssist
        title={title}
        description={description}
        onApplyCategory={(cat) => setCategory(cat)}
        onApplyDescription={(desc) => setDescription(desc)}
      />

      {/* Image Uploader */}
      <ImageUploader
        currentImageUrl={initialListing?.image_url}
        onFileSelect={(file) => setSelectedFile(file)}
        onRemoveCurrentImage={() => setImagePath(null)}
      />

      {/* Contact Preference & Privacy Notice */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
        <label className="block text-sm font-semibold text-slate-800">
          Contact & Handoff Preference
        </label>
        <p className="text-xs text-slate-500">
          Your direct email or phone is kept private. Other students will reach you through in-app
          requests.
        </p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="contact_pref"
              checked={contactPreference === 'in_app'}
              onChange={() => setContactPreference('in_app')}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            In-app messaging (Recommended)
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="radio"
              name="contact_pref"
              checked={contactPreference === 'email_notification'}
              onChange={() => setContactPreference('email_notification')}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            Email notifications
          </label>
        </div>
      </div>

      {/* Consent Checkbox */}
      <div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            I confirm that I have permission to post this item and any attached photos, and I
            understand this listing will be publicly visible to members of the campus community.{' '}
            <span className="text-rose-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.consent}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || uploadingImage}
          className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {(isSubmitting || uploadingImage) && <Loader2 className="w-4 h-4 animate-spin" />}
          {uploadingImage
            ? 'Uploading Photo...'
            : isSubmitting
            ? 'Saving Listing...'
            : isEditing
            ? 'Save Changes'
            : 'Publish Campus Listing'}
        </button>
      </div>
    </form>
  );
};
