import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { LISTING_STATUS } from '../../utils/constants';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/listings/mine');
      setListings(data.listings || []);
    } catch {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/listings/mine/${id}`);
      toast.success('Deleted');
      load();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My listings</h1>
        <Link
          to="/dashboard/listings/new"
          className="inline-flex justify-center px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-sm"
        >
          Add listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-slate-500">You have no listings yet.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((l, i) => {
            const st = LISTING_STATUS[l.status] || LISTING_STATUS.pending;
            const badge =
              l.status === 'approved'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                : l.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
            return (
              <motion.div
                key={l._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <img
                  src={l.images?.[0] || '/placeholder-house.svg'}
                  alt=""
                  className="w-full sm:w-40 h-32 object-cover rounded-xl bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-slate-900 dark:text-white truncate">{l.title}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>{st.label}</span>
                  </div>
                  <p className="text-primary-600 font-bold">${l.price}/mo</p>
                  <p className="text-sm text-slate-500 line-clamp-2">{l.address}</p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link
                    to={`/dashboard/listings/${l._id}/edit`}
                    className="px-3 py-2 text-center rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(l._id)}
                    className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
