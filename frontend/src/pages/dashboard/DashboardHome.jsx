import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlinePlusCircle, HiOutlineViewGrid } from 'react-icons/hi';

export default function DashboardHome() {
  const user = useSelector((s) => s.auth.user);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Hello, {user?.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">
          Manage your rental listings. New submissions stay pending until an admin approves them.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/dashboard/listings/new"
          className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <HiOutlinePlusCircle className="w-10 h-10 shrink-0" />
          <div>
            <p className="font-bold text-lg">New listing</p>
            <p className="text-primary-100 text-sm">Add photos and details</p>
          </div>
        </Link>
        <Link
          to="/dashboard/listings"
          className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card hover:border-primary-300 transition-colors"
        >
          <HiOutlineViewGrid className="w-10 h-10 text-primary-600 shrink-0" />
          <div>
            <p className="font-bold text-lg text-slate-900 dark:text-white">My listings</p>
            <p className="text-slate-500 text-sm">Edit or delete drafts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
