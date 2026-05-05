import { motion } from 'framer-motion';

export default function SkeletonListingCard() {
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark border border-slate-100 dark:border-slate-800"
    >
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-full" />
      </div>
    </motion.div>
  );
}
