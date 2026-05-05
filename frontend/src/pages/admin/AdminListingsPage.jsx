import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [refresh, setRefresh] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (status) params.set('status', status);
      const { data } = await api.get(`/admin/listings?${params}`);
      setListings(data.listings || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings, refresh]);

  const act = async (id, action) => {
    try {
      if (action === 'approve') await api.patch(`/admin/listings/${id}/approve`);
      if (action === 'reject') await api.patch(`/admin/listings/${id}/reject`);
      if (action === 'delete') {
        if (!confirm('Delete this listing permanently?')) return;
        await api.delete(`/admin/listings/${id}`);
      }
      toast.success('Done');
      setRefresh((n) => n + 1);
    } catch (e) {
      toast.error(e.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Listings moderation</h1>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="space-y-4">
        {listings.map((l) => (
          <div
            key={l._id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4"
          >
            <img
              src={l.images?.[0] || '/placeholder-house.svg'}
              alt=""
              className="w-full lg:w-48 h-36 object-cover rounded-xl bg-slate-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-semibold text-slate-900 dark:text-white">{l.title}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{l.status}</span>
              </div>
              <p className="text-primary-600 font-bold">${l.price}/mo</p>
              <p className="text-sm text-slate-500">{l.address}</p>
              <p className="text-xs text-slate-400 mt-2">
                Owner: {l.createdBy?.name} ({l.createdBy?.email})
              </p>
              {l.status === 'approved' && (
                <Link to={`/listings/${l._id}`} className="text-sm text-primary-600 font-medium mt-2 inline-block">
                  View public page
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:justify-center shrink-0">
              {l.status !== 'approved' && (
                <button
                  type="button"
                  onClick={() => act(l._id, 'approve')}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium"
                >
                  Approve
                </button>
              )}
              {l.status !== 'rejected' && (
                <button
                  type="button"
                  onClick={() => act(l._id, 'reject')}
                  className="px-3 py-2 rounded-xl bg-amber-600 text-white text-sm font-medium"
                >
                  Reject
                </button>
              )}
              <button
                type="button"
                onClick={() => act(l._id, 'delete')}
                className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && <p className="text-slate-500 text-center py-12">No listings.</p>}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-xl border disabled:opacity-40"
          >
            Previous
          </button>
          <span className="py-2 text-sm">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
