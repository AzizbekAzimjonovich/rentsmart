import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { logout } from "../redux/authSlice";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300"
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const links = [
    { to: "/", label: "Home" },
    { to: "/listings", label: "Listings" },
  ];

  if (user) {
    links.push({ to: "/dashboard", label: "Dashboard" });
    if (user.role === "admin") {
      links.push({ to: "/admin", label: "Admin" });
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-blue-700 flex items-center justify-center text-white text-sm">
            UZ
          </span>
          UzRent
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Log in
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-lg shadow-primary-600/25">
                Sign up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600">
              Log out
            </button>
          )}

          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu">
            {open ? (
              <HiXMark className="w-6 h-6" />
            ) : (
              <HiBars3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="px-4 py-4 flex flex-col gap-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={navLinkClass}
                  onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              ))}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium"
                    onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-xl bg-primary-600 text-white text-center text-sm font-semibold"
                    onClick={() => setOpen(false)}>
                    Sign up
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  className="text-left px-3 py-2 text-sm"
                  onClick={() => {
                    dispatch(logout());
                    setOpen(false);
                  }}>
                  Log out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
