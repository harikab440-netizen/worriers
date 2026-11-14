import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ListingItem,
  ContactRequestItem,
  ListingStatus
} from '@campus/shared';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ListingStatusBadge } from '../components/listings/ListingStatusBadge';
import { ListingTypeBadge } from '../components/listings/ListingTypeBadge';
import { ContactRequestCard } from '../components/contact/ContactRequestCard';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Package,
  Inbox,
  Send,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, token, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'listings' | 'received' | 'sent'>('listings');
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ContactRequestItem[]>([]);
  const [sentRequests, setSentRequests] = useState<ContactRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Listing status filter inside dashboard
  const [statusFilter, setStatusFilter] = useState<'all' | ListingStatus>('all');

  // Deletion modal state
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit profile state
  const [editingProfile, setEditingProfile] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.display_name || '');

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [listingsData, requestsData] = await Promise.all([
        api.getUserListings(token),
        api.getUserContactRequests(token)
      ]);
      setListings(listingsData);
      setReceivedRequests(requestsData.received);
      setSentRequests(requestsData.sent);
    } catch (err: any) {
      toastError('Error Loading Dashboard', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleToggleStatus = async (listing: ListingItem) => {
    if (!token) return;
    const newStatus: ListingStatus = listing.status === 'active' ? 'returned' : 'active';
    try {
      await api.updateListing(listing.id, { status: newStatus }, token);
      success(
        'Status Updated',
        `Listing marked as ${newStatus === 'returned' ? 'Returned' : 'Active'}.`
      );
      loadData();
    } catch (err: any) {
      toastError('Could not update status', err.message);
    }
  };

  const handleDeleteListing = async () => {
    if (!token || !listingToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteListing(listingToDelete, token);
      success('Listing Deleted', 'Your item listing was successfully removed.');
      setListingToDelete(null);
      loadData();
    } catch (err: any) {
      toastError('Could not delete listing', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) return;
    const { error } = await updateProfile(newDisplayName.trim());
    if (error) {
      toastError('Profile update failed', error);
    } else {
      success('Profile updated', 'Your display name has been saved.');
      setEditingProfile(false);
    }
  };

  const filteredListings = listings.filter((l) =>
    statusFilter === 'all' ? true : l.status === statusFilter
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-100 flex-shrink-0">
            {user?.display_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            {editingProfile ? (
              <form onSubmit={handleSaveProfile} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{user?.display_name}</h1>
                <button
                  onClick={() => {
                    setNewDisplayName(user?.display_name || '');
                    setEditingProfile(true);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Edit Name
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-600">
              <span>{listings.length} Listings posted</span>
              <span>•</span>
              <span>{receivedRequests.length} Received inquiries</span>
            </div>
          </div>
        </div>

        <Link
          to="/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Listing
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'listings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listings</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'listings'
                ? 'bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {listings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'received'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Inquiries</span>
          {receivedRequests.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'received'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-indigo-100 text-indigo-700 font-bold'
              }`}
            >
              {receivedRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Inquiries</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'sent'
                ? 'bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingState message="Loading your dashboard data..." className="py-24" />
      ) : activeTab === 'listings' ? (
        <div className="space-y-4">
          {/* Status Sub-filter */}
          {listings.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Filter by status:</span>
              {(['all', 'active', 'returned', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}

          {filteredListings.length === 0 ? (
            <EmptyState
              title="No listings found"
              description={
                listings.length === 0
                  ? "You haven't posted any lost or found items yet."
                  : 'No listings match the selected status filter.'
              }
              action={
                <Link
                  to="/listings/new"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  <PlusCircle className="w-4 h-4" />
                  Post an Item
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <ListingTypeBadge type={listing.type} />
                        <ListingStatusBadge status={listing.status} />
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(listing.occurred_on).toLocaleDateString()}
                      </span>
                    </div>

                    <Link
                      to={`/listings/${listing.id}`}
                      className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mt-2 mb-1"
                    >
                      {listing.title}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {listing.description}
                    </p>
                  </div>

                  {/* Actions bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleStatus(listing)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {listing.status === 'active' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Mark Returned
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                          Reopen Listing
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/listings/${listing.id}/edit`}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Listing"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setListingToDelete(listing.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'received' ? (
        <div>
          {receivedRequests.length === 0 ? (
            <EmptyState
              title="No inquiries received yet"
              description="When other students submit a contact request on your listings, you will be able to review and reply to them here."
              icon={<Inbox className="w-7 h-7" />}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {receivedRequests.map((req) => (
                <ContactRequestCard key={req.id} request={req} mode="received" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {sentRequests.length === 0 ? (
            <EmptyState
              title="No contact requests sent"
              description="Browse active lost or found listings and send an inquiry if you recognise an item."
              icon={<Send className="w-7 h-7" />}
              action={
                <Link
                  to="/"
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl inline-block"
                >
                  Browse Campus Listings
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sentRequests.map((req) => (
                <ContactRequestCard key={req.id} request={req} mode="sent" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(listingToDelete)}
        title="Delete this listing?"
        message="This action cannot be undone. The listing and all associated inquiries will be permanently removed."
        confirmLabel="Yes, Delete Listing"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteListing}
        onCancel={() => setListingToDelete(null)}
      />
    </div>
  );
};
