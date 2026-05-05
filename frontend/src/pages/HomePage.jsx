import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';
import { RENTAL_TYPES } from '../utils/constants';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [f, r] = await Promise.all([
          api.get('/listings/featured?limit=6'),
          api.get('/listings/recent?limit=5'),
        ]);
        if (!cancelled) {
          setFeatured(f.data.listings || []);
          setRecent(r.data.listings || []);
        }
      } catch {
        if (!cancelled) {
          setFeatured([]);
          setRecent([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('search', q.trim());
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      <section className="relative gradient-hero text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 75%, transparent 75%, transparent)',
            backgroundSize: '100% 100%, 24px 24px',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-primary-200 font-medium mb-2">Trusted rentals across Uzbekistan</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find your next home with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-white">
                UzRent
              </span>
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-xl">
              Browse verified listings, filter by price and location, and contact owners directly.
            </p>

            <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by city, address, or keyword..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-slate-900 shadow-xl border-0 focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition-colors shadow-lg"
              >
                Search
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {RENTAL_TYPES.map((c, i) => (
            <motion.div
              key={c.value}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/listings?rentalType=${c.value}`}
                className="block p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-card-dark hover:border-primary-400 hover:shadow-lg transition-all text-center font-medium text-slate-800 dark:text-slate-100"
              >
                {c.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured listings</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Hand-picked from our newest approved homes</p>
          </div>
          <Link
            to="/listings"
            className="text-primary-600 dark:text-primary-400 font-semibold text-sm hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonListingCard key={i} />)
            : featured.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
        </div>
      </section>

      <section className="bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Recently added</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonListingCard key={i} />)
              : recent.map((l, i) => <ListingCard key={l._id} listing={l} index={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
