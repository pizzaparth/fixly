import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Store, LogOut, ClipboardList, PlusCircle, Wrench } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { session, logout, setAuthModalOpen } = useStore();

  const isHome = loc.pathname === '/';
  const isShop = loc.pathname.startsWith('/shop');
  const isOnboard = loc.pathname.startsWith('/onboard');
  const isRequests = loc.pathname.startsWith('/my-requests');

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="sticky top-4 z-40 mx-auto max-w-6xl px-4"
    >
      <div className="bg-white/95 backdrop-blur-md border-2 border-zinc-900 rounded-md px-5 py-3 flex items-center justify-between shadow-sm">
        {/* Logo with Wobble Animation */}
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
            className="text-2xl flex items-center"
          >
            🔧
          </motion.span>
          <span className="font-black text-lg text-zinc-950 tracking-tight">
            Fixly
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 cursor-pointer ${
                isHome
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              <Home size={16} />
              <span>Home</span>
            </motion.button>
          </Link>

          {session && (
            <Link to="/my-requests">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 cursor-pointer ${
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

          {session ? (
            <Link to={session.role === 'shop' ? '/shop' : '/onboard'}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 cursor-pointer ${
                  isShop || isOnboard
                    ? 'bg-purple-600 text-white'
                    : 'bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-zinc-200'
                }`}
              >
                <Store size={16} />
                <span>{session.role === 'shop' ? 'Dashboard' : 'List Shop'}</span>
              </motion.button>
            </Link>
          ) : (
            <Link to="/onboard">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 cursor-pointer ${
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
              className="px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-1.5 cursor-pointer bg-zinc-100 text-zinc-800 border border-zinc-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300"
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
              className="px-4 py-2 rounded-md font-semibold text-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign in
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
