import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLocationOutline, IoCallOutline, IoBedOutline } from 'react-icons/io5';
import api from '../services/api';
import ListingCard from '../components/ListingCard';
import Spinner from '../components/Spinner';
import { RENTAL_TYPES } from '../utils/constants';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    let c = true;
    (async () => {
      try {
        const { data: res } = await api.get(`/listings/public/${id}`);
        if (c) setData(res);
      } catch {
        if (c) setData(null);
      } finally {
        if (c) setLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!data?.listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Listing not found</h1>
        <Link to="/listings" className="text-primary-600 font-semibold">
          Back to listings
        </Link>
      </div>
    );
  }

  const { listing, similar } = data;
  const images = listing.images?.length ? listing.images : [];
  const mainImg = images[imgIdx] || '/placeholder-house.svg';
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(listing.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const typeLabel = RENTAL_TYPES.find((t) => t.value === listing.rentalType)?.label;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-card dark:shadow-card-dark mb-3">
            <img src={mainImg} alt="" className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                    i === imgIdx ? 'border-primary-500' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {typeLabel && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
                {typeLabel}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{listing.title}</h1>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            ${listing.price}
            <span className="text-lg font-normal text-slate-500">/month</span>
          </p>
          <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-4">
            <IoLocationOutline className="shrink-0 text-xl" />
            {listing.address}
          </p>
          <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-6">
            <IoBedOutline className="text-xl" />
            {listing.rooms} rooms
          </p>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 mb-6">
            <p className="text-sm font-semibold text-slate-500 uppercase mb-2">Contact</p>
            <a
              href={`tel:${listing.contact}`}
              className="flex items-center gap-2 text-lg font-semibold text-primary-600 dark:text-primary-400"
            >
              <IoCallOutline />
              {listing.contact}
            </a>
          </div>
          <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {listing.description}
          </p>
        </motion.div>
      </div>

      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Location</h2>
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-80 shadow-inner">
          <iframe
            title="Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          />
        </div>
      </section>

      {similar?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Similar listings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((l, i) => (
              <ListingCard key={l._id} listing={l} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
