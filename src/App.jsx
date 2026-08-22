import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Home } from './pages/Home';
import { ShopDashboard } from './pages/ShopDashboard';
import { ShopOnboard } from './pages/ShopOnboard';
import { MyRequests } from './pages/MyRequests';

function AnimatedRoutes() {
  const loc = useLocation();
  const { session } = useStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loc.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={loc}>
          <Route path="/" element={<Navigate to={session?.role === 'shop' ? "/shop" : "/home"} replace />} />
          <Route path="/home" element={session?.role === 'shop' ? <Navigate to="/shop" replace /> : <Home />} />
          <Route path="/shop" element={session?.role === 'shop' ? <ShopDashboard /> : <Navigate to="/home" replace />} />
          <Route path="/onboard" element={<ShopOnboard />} />
          <Route path="/my-requests" element={session?.role === 'customer' ? <MyRequests /> : <Navigate to="/home" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function MainLayout() {
  const { authModalOpen, setAuthModalOpen } = useStore();

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <AnimatedRoutes />
      </main>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <footer className="border-t-2 border-zinc-900 bg-zinc-50 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-[11px]">
              F
            </span>
            <span className="text-zinc-950">Fixly · Open Repair Hub</span>
          </div>
          <p className="normal-case text-zinc-500 font-medium text-xs">
            Connecting consumers with trusted neighborhood repair technicians.
          </p>
          <div className="flex items-center gap-4 text-zinc-700">
            <span>Direct P2P Settlement</span>
            <span>•</span>
            <span>Zero Platform Cuts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <MainLayout />
      </StoreProvider>
    </BrowserRouter>
  );
}
