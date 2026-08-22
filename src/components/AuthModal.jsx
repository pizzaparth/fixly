import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from './Modal';
import { SolidButton } from './ui-custom';
import { User, Store, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AuthModal({ open, onClose }) {
  const { login } = useStore();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('customer'); // 'customer' | 'shop'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const finalEmail = email.trim() || (role === 'shop' ? 'technician@fixly.local' : 'customer@fixly.local');
    const finalName = name.trim() || (role === 'shop' ? 'Master Technician' : finalEmail.split('@')[0]);

    login({
      role,
      name: finalName,
      email: finalEmail,
      phone: phone || '+91 98765 43210',
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'login' ? 'Sign in to Fixly' : 'Create Fixly Account'}
      maxWidth="max-w-md"
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-zinc-100 border border-zinc-200">
          {(['customer', 'shop']).map((r) => (
            <motion.button
              key={r}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setRole(r)}
              className={`relative py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                role === r ? 'text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              {role === r && (
                <motion.span
                  layoutId="authRoleTab"
                  className={`absolute inset-0 rounded-sm ${r === 'shop' ? 'bg-purple-600' : 'bg-blue-600'}`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5 z-10">
                {r === 'customer' ? <User size={14} /> : <Store size={14} />}
                {r === 'customer' ? 'I am a Customer' : 'I am a Repair Shop'}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-zinc-200 pb-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1 text-sm font-bold border-b-2 cursor-pointer ${
              mode === 'login'
                ? 'border-black text-zinc-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1 text-sm font-bold border-b-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-black text-zinc-950'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Input fields */}
        <AnimatePresence mode="wait">
          {mode === 'signup' && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col gap-1"
            >
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                {role === 'shop' ? 'Shop Owner Name' : 'Full Name'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'shop' ? 'e.g. Ramesh Kumar' : 'e.g. Priya Reddy'}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {mode === 'signup' && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        <SolidButton
          type="submit"
          variant={role === 'shop' ? 'purple' : 'blue'}
          className="w-full py-2.5 mt-2 text-sm font-bold"
        >
          {mode === 'login' ? `Sign In as ${role === 'shop' ? 'Repair Shop' : 'Customer'}` : 'Create Free Account'}
        </SolidButton>

        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          <ShieldCheck size={14} className="text-green-600" />
          <span>Demo mode active · Auto credentials filled</span>
        </div>
      </form>
    </Modal>
  );
}
