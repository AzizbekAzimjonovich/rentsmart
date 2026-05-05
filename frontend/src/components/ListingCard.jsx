import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IoLocationOutline, IoBedOutline } from 'react-icons/io5';
import { RENTAL_TYPES } from '../utils/constants';

export default function ListingCard({ listing, index = 0 }) {
  const img = listing.images?.[0] || '/placeholder-house.svg';
  const typeLabel = RENTAL_TYPES.find((t) => t.value === listing.rentalType)?.label;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark border border-slate-100 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300"
    >
      <Link to={`/listings/${listing._id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={img}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                'data:image/svg+xml,' +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23e2e8f0"><rect width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif">No image</text></svg>'
                );
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {listing.title}
            </h3>
            <span className="shrink-0 text-primary-600 dark:text-primary-400 font-bold">
              ${listing.price}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </span>
          </div>
          <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <IoLocationOutline className="shrink-0" />
            <span className="line-clamp-1">{listing.address}</span>
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <IoBedOutline />
              {listing.rooms} rooms
            </span>
            {typeLabel && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                {typeLabel}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {listing.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
