import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';
import { RENTAL_TYPES, SORT_OPTIONS } from '../utils/constants';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const location = searchParams.get('location') || '';
  const rooms = searchParams.get('rooms') || '';
  const rentalType = searchParams.get('rentalType') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '12');
      if (search) params.set('search', search);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (location) params.set('location', location);
      if (rooms) params.set('rooms', rooms);
      if (rentalType && rentalType !== 'all') params.set('rentalType', rentalType);
      if (sort) params.set('sort', sort);
      const { data } = await api.get(`/listings/public?${params.toString()}`);
      setListings(data.listings || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [search, minPrice, maxPrice, location, rooms, rentalType, sort, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === 'all') next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">All listings</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Filter and sort verified rental properties</p>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">
        <div className="lg:col-span-1 space-y-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark h-fit">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Search</label>
            <input
              type="search"
              defaultValue={search}
              onBlur={(e) => updateParam('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateParam('search', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              placeholder="Keywords..."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Min $</label>
              <input
                type="number"
                defaultValue={minPrice}
                onBlur={(e) => updateParam('minPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Max $</label>
              <input
                type="number"
                defaultValue={maxPrice}
                onBlur={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Location</label>
            <input
              type="text"
              defaultValue={location}
              onBlur={(e) => updateParam('location', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              placeholder="Address contains..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rooms</label>
            <select
              value={rooms}
              onChange={(e) => updateParam('rooms', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Type</label>
            <select
              value={rentalType}
              onChange={(e) => updateParam('rentalType', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            >
              <option value="all">All types</option>
              {RENTAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sort</label>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:col-span-3">
          <p className="text-sm text-slate-500 mb-4">
            {pagination.total} listing{pagination.total !== 1 ? 's' : ''} found
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonListingCard key={i} />)
              : listings.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
          </div>
          {!loading && listings.length === 0 && (
            <p className="text-center py-16 text-slate-500">No listings match your filters.</p>
          )}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(page - 1));
                  setSearchParams(next);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(page + 1));
                  setSearchParams(next);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
