import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Store, LogOut, ClipboardList, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { session, logout, setAuthModalOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = loc.pathname === '/';
  const isShop = loc.pathname.startsWith('/shop');
  const isOnboard = loc.pathname.startsWith('/onboard');
  const isRequests = loc.pathname.startsWith('/my-requests');

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full bg-white/95 backdrop-blur-md border-2 border-zinc-900 rounded-full px-6 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        {/* Brand Logo */}
        <Link to="/" onClick={closeMobile} className="flex items-center gap-2.5">
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
            className="text-2xl flex items-center"
          >
            🔧
          </motion.span>
          <span className="font-black text-xl text-zinc-950 tracking-tight">
            Fixly
          </span>
        </Link>

        {/* Desktop Nav Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* 1. Home / Explore */}
          <Link to="/">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-colors ${
                isHome
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <Home size={16} />
              <span>Home</span>
            </motion.button>
          </Link>

          {/* 2. Customer Mode: Only "My Repairs" (No "List Shop") */}
          {session?.role === 'customer' && (
            <Link to="/my-requests">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isRequests
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
                }`}
              >
                <ClipboardList size={16} />
                <span>My Repairs</span>
              </motion.button>
            </Link>
          )}

          {/* 3. Repair Shop Mode: Only "Dashboard" (No "My Repairs") */}
          {session?.role === 'shop' && (
            <Link to="/shop">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isShop
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
                }`}
              >
                <Store size={16} />
                <span>Dashboard</span>
              </motion.button>
            </Link>
          )}

          {/* 4. Guest Mode (Not signed in): "List Shop" */}
          {!session && (
            <Link to="/onboard">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isOnboard
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
                }`}
              >
                <Store size={16} />
                <span>List Shop</span>
              </motion.button>
            </Link>
          )}

          {/* 5. Session Auth / Sign Out */}
          {session ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => {
                logout();
                nav('/');
              }}
              className="px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
            >
              <LogOut size={16} />
              <span>{session.name.split(' ')[0]}</span>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => setAuthModalOpen(true)}
              className="px-5 py-2 rounded-full font-bold text-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              Sign in
            </motion.button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {session && (
            <span className="text-xs font-black text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              {session.name.split(' ')[0]}
            </span>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-full bg-zinc-100 border border-zinc-300 text-zinc-900 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Collapsible Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="md:hidden mt-2 p-4 bg-white border-2 border-zinc-900 rounded-3xl shadow-xl flex flex-col gap-2.5"
          >
            <Link to="/" onClick={closeMobile}>
              <div
                className={`p-3 rounded-full font-bold text-sm flex items-center gap-2.5 ${
                  isHome ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900 border border-zinc-200'
                }`}
              >
                <Home size={18} />
                <span>Home / Explore</span>
              </div>
            </Link>

            {session?.role === 'customer' && (
              <Link to="/my-requests" onClick={closeMobile}>
                <div
                  className={`p-3 rounded-full font-bold text-sm flex items-center gap-2.5 ${
                    isRequests ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900 border border-zinc-200'
                  }`}
                >
                  <ClipboardList size={18} />
                  <span>My Repair Requests</span>
                </div>
              </Link>
            )}

            {session?.role === 'shop' && (
              <Link to="/shop" onClick={closeMobile}>
                <div
                  className={`p-3 rounded-full font-bold text-sm flex items-center gap-2.5 ${
                    isShop ? 'bg-purple-600 text-white' : 'bg-zinc-50 text-zinc-900 border border-zinc-200'
                  }`}
                >
                  <Store size={18} />
                  <span>Shop Dashboard</span>
                </div>
              </Link>
            )}

            {!session && (
              <Link to="/onboard" onClick={closeMobile}>
                <div
                  className={`p-3 rounded-full font-bold text-sm flex items-center gap-2.5 ${
                    isOnboard ? 'bg-purple-600 text-white' : 'bg-zinc-50 text-zinc-900 border border-zinc-200'
                  }`}
                >
                  <Store size={18} />
                  <span>List Your Shop</span>
                </div>
              </Link>
            )}

            <div className="pt-2 border-t border-zinc-200 flex justify-stretch">
              {session ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobile();
                    nav('/');
                  }}
                  className="w-full p-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Sign out ({session.name})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    setAuthModalOpen(true);
                  }}
                  className="w-full p-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 text-white cursor-pointer"
                >
                  <span>Sign in / Sign up</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
