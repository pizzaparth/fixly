import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Wrench, Home, Store, LogOut, PlusCircle, ClipboardList, User } from 'lucide-react';
import { SolidButton, SolidBadge } from './ui-custom';
import { useStore } from '../context/StoreContext';

export function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const { session, logout, setAuthModalOpen, orders } = useStore();

  const isHome = loc.pathname === '/';
  const isShop = loc.pathname.startsWith('/shop');
  const isOnboard = loc.pathname.startsWith('/onboard');
  const isRequests = loc.pathname.startsWith('/my-requests');

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'ongoing'
  ).length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="sticky top-0 z-40 bg-white border-b-2 border-zinc-900 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            animate={{ rotate: [0, -12, 12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'mirror' }}
            className="size-9 rounded-md bg-blue-600 flex items-center justify-center text-white shadow-sm font-black"
          >
            <Wrench size={20} className="stroke-[2.5]" />
          </motion.div>
          <div>
            <span className="font-black text-xl text-zinc-950 tracking-tight block leading-none">
              FIXLY
            </span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mt-0.5">
              Repair & Restore
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Home Link */}
          <Link to="/">
            <SolidButton
              variant={isHome ? 'primary' : 'ghost'}
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Home size={15} />
              <span className="hidden sm:inline">Explore</span>
            </SolidButton>
          </Link>

          {/* Customer My Repairs Link */}
          <Link to="/my-requests">
            <SolidButton
              variant={isRequests ? 'primary' : 'ghost'}
              size="sm"
              className="text-xs sm:text-sm relative"
            >
              <ClipboardList size={15} />
              <span>My Repairs</span>
              {pendingOrdersCount > 0 && (
                <span className="size-2 rounded-none bg-blue-600 ring-2 ring-white inline-block ml-1" />
              )}
            </SolidButton>
          </Link>

          {/* Shop Dashboard Link */}
          <Link to="/shop">
            <SolidButton
              variant={isShop ? 'purple' : 'ghost'}
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Store size={15} />
              <span className="hidden sm:inline">Shop Hub</span>
            </SolidButton>
          </Link>

          {/* Onboard Shop Link */}
          <Link to="/onboard">
            <SolidButton
              variant={isOnboard ? 'primary' : 'outline'}
              size="sm"
              className="text-xs sm:text-sm border-zinc-900"
            >
              <PlusCircle size={15} className="text-pink-600" />
              <span className="hidden md:inline">List Shop</span>
            </SolidButton>
          </Link>

          {/* Auth Session / Profile Button */}
          {session ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-zinc-900 leading-tight truncate max-w-[120px]">
                  {session.name}
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  {session.role === 'shop' ? 'Technician' : 'Customer'}
                </span>
              </div>
              <SolidButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  nav('/');
                }}
                className="text-xs text-zinc-700 hover:text-rose-600 hover:bg-rose-50"
                title="Sign out"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Sign out</span>
              </SolidButton>
            </div>
          ) : (
            <SolidButton
              variant="blue"
              size="sm"
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider"
            >
              <User size={15} />
              <span>Sign In</span>
            </SolidButton>
          )}
        </div>
      </div>
    </motion.header>
  );
}
