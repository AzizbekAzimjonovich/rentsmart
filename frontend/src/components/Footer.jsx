import { Link } from 'react-router-dom';
import { FaGithub, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-lg text-primary-600 dark:text-primary-400 mb-2">UzRent</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Modern house and apartment rentals. Find your next home with verified listings.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white mb-3">Explore</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/listings" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">
                  All listings
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-600 dark:text-slate-400 hover:text-primary-600">
                  List your property
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white mb-3">Connect</p>
            <div className="flex gap-3 text-slate-500">
              <a href="#" className="hover:text-primary-600" aria-label="GitHub">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-600" aria-label="Telegram">
                <FaTelegram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} UzRent. Demo project.
        </p>
      </div>
    </footer>
  );
}
