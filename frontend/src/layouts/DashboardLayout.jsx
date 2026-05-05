import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineViewGrid,
  HiOutlineUser,
  HiOutlinePlusCircle,
} from "react-icons/hi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Navbar from "../components/Navbar";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30"
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  }`;

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Overview", icon: HiOutlineHome, end: true },
    {
      to: "/dashboard/listings",
      label: "My listings",
      icon: HiOutlineViewGrid,
    },
    {
      to: "/dashboard/listings/new",
      label: "New listing",
      icon: HiOutlinePlusCircle,
    },
    { to: "/dashboard/profile", label: "Profile", icon: HiOutlineUser },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">
            Menu
          </p>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                <l.icon className="w-5 h-5" />
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="font-semibold text-slate-900 dark:text-white">
              Dashboard
            </span>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700"
              aria-label="Open menu">
              <HiBars3 className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black/40 z-40"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close overlay"
                />
                <motion.aside
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 28 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shadow-xl">
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Close">
                      <HiXMark className="w-6 h-6" />
                    </button>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {links.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        end={l.end}
                        className={linkClass}
                        onClick={() => setSidebarOpen(false)}>
                        <l.icon className="w-5 h-5" />
                        {l.label}
                      </NavLink>
                    ))}
                  </nav>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
