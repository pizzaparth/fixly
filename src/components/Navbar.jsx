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

  const isHome = loc.pathname === '/home';
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
      {/* Liquid Frosted Glass Pill Navbar */}
      <div className="w-full bg-white/45 backdrop-blur-2xl backdrop-saturate-200 border border-white/70 ring-1 ring-zinc-900/10 rounded-full px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] transition-all">
        {/* Brand Logo */}
        <Link to={session?.role === 'shop' ? "/shop" : "/home"} onClick={closeMobile} className="flex items-center">
          <span className="font-black text-xl text-zinc-950 tracking-tight px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-colors duration-200">
            Fixly
          </span>
        </Link>

        {/* Desktop Nav Controls with Frosted Translucency */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* 1. Home / Explore - Hidden for Shops */}
          {session?.role !== 'shop' && (
            <Link to="/home">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                  isHome
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white/40 hover:bg-white/80 text-zinc-800 border border-zinc-900/10 backdrop-blur-md'
                }`}
              >
                <Home size={16} />
                <span>Home</span>
              </motion.button>
            </Link>
          )}

          {/* 2. Customer Mode: Only "My Repairs" (No "List Shop") */}
          {session?.role === 'customer' && (
            <Link to="/my-requests">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                  isRequests
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white/40 hover:bg-white/80 text-zinc-800 border border-zinc-900/10 backdrop-blur-md'
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
                className={`px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-all ${
                  isShop
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white/40 hover:bg-white/80 text-zinc-800 border border-zinc-900/10 backdrop-blur-md'
                }`}
              >
                <Store size={16} />
                <span>Dashboard</span>
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
                nav('/home');
              }}
              className="px-5 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 cursor-pointer bg-white/40 hover:bg-rose-50/90 text-zinc-800 border border-zinc-900/10 hover:text-rose-600 hover:border-rose-300 backdrop-blur-md transition-all"
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
              className="px-6 py-2 rounded-full font-bold text-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
            >
              Sign in
            </motion.button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {session && (
            <span className="text-xs font-black text-zinc-900 bg-white/60 px-3 py-1 rounded-full border border-zinc-900/10 backdrop-blur-md">
              {session.name.split(' ')[0]}
            </span>
          )}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2.5 rounded-full bg-white/50 backdrop-blur-md border border-zinc-900/15 text-zinc-900 cursor-pointer shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Collapsible Frosted Glass Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="md:hidden mt-2 p-4 bg-white/65 backdrop-blur-2xl backdrop-saturate-200 border border-white/70 ring-1 ring-zinc-900/10 rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] flex flex-col gap-2.5"
          >
            {session?.role !== 'shop' && (
              <Link to="/home" onClick={closeMobile}>
                <div
                  className={`p-3.5 rounded-full font-bold text-sm flex items-center gap-2.5 transition-colors ${
                    isHome ? 'bg-black text-white' : 'bg-white/50 text-zinc-900 border border-zinc-900/10 backdrop-blur-md'
                  }`}
                >
                  <Home size={18} />
                  <span>Home / Explore</span>
                </div>
              </Link>
            )}

            {session?.role === 'customer' && (
              <Link to="/my-requests" onClick={closeMobile}>
                <div
                  className={`p-3.5 rounded-full font-bold text-sm flex items-center gap-2.5 transition-colors ${
                    isRequests ? 'bg-black text-white' : 'bg-white/50 text-zinc-900 border border-zinc-900/10 backdrop-blur-md'
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
                  className={`p-3.5 rounded-full font-bold text-sm flex items-center gap-2.5 transition-colors ${
                    isShop ? 'bg-purple-600 text-white' : 'bg-white/50 text-zinc-900 border border-zinc-900/10 backdrop-blur-md'
                  }`}
                >
                  <Store size={18} />
                  <span>Shop Dashboard</span>
                </div>
              </Link>
            )}



            <div className="pt-2 border-t border-zinc-900/10 flex justify-stretch">
              {session ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobile();
                    nav('/home');
                  }}
                  className="w-full p-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-rose-50/80 text-rose-600 border border-rose-200/80 backdrop-blur-md cursor-pointer"
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
                  className="w-full p-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 text-white shadow-md cursor-pointer"
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
