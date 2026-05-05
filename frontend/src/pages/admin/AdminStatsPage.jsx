import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Spinner from '../../components/Spinner';
import { HiUsers, HiViewGrid, HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let c = true;
    (async () => {
      try {
        const { data } = await api.get('/admin/stats');
        if (c) setStats(data.stats);
      } finally {
        if (c) setLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const cards = [
    { label: 'Users', value: stats?.users, icon: HiUsers, color: 'from-blue-500 to-primary-600' },
    { label: 'All listings', value: stats?.listings, icon: HiViewGrid, color: 'from-violet-500 to-purple-600' },
    { label: 'Pending', value: stats?.pending, icon: HiClock, color: 'from-amber-500 to-orange-600' },
    { label: 'Approved', value: stats?.approved, icon: HiCheckCircle, color: 'from-emerald-500 to-teal-600' },
    { label: 'Rejected', value: stats?.rejected, icon: HiXCircle, color: 'from-rose-500 to-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Statistics</h1>
      <p className="text-slate-500 mb-8">Overview of platform activity</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-card flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}
            >
              <card.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{card.value ?? '—'}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
