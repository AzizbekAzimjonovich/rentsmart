import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleTheme } from '../redux/themeSlice';
import { HiMoon, HiSun } from 'react-icons/hi2';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700 hover:border-primary-400 transition-colors"
      aria-label={mode === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {mode === 'dark' ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
    </motion.button>
  );
}
