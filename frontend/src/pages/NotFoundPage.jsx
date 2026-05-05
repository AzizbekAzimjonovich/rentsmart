import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary-600 mb-2">404</h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">Page not found</p>
      <Link to="/" className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold">
        Back home
      </Link>
    </div>
  );
}
