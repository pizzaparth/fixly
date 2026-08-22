import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Store, ShieldCheck, Mail, Lock, Phone, Check, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockData';

export function AuthModal({ open, onClose }) {
  const { login, addShop } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('customer');
  
  // Base fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Extra shop fields
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [services, setServices] = useState(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]))
  );

  const toggleCategory = (catKey) => {
    setServices((prev) => ({
      ...prev,
      [catKey]: prev[catKey] === 0 ? 500 : 0,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (mode === 'signup' && role === 'shop') {
      if (!shopName.trim() || !name.trim() || !phone.trim() || !address.trim()) {
        alert('Please fill out all required shop details.');
        return;
      }
      
      const selectedCategories = Object.keys(services).filter((k) => services[k] > 0);
      if (selectedCategories.length === 0) {
        alert('Please select at least one repair service category.');
        return;
      }

      const basePrice = Math.min(...selectedCategories.map((k) => services[k]));

      // 1. Create technician user via login
      const user = await login({
        role: 'shop',
        name: name,
        email: email || `${shopName.toLowerCase().replace(/\s+/g, '')}@fixly.local`,
        password,
        phone,
      });

      if (user) {
        // 2. Create listing via addShop
        await addShop({
          technicianId: user.id,
          name: shopName,
          owner: name,
          mobile: phone,
          address: `${address}, ${city}`,
          estCost: basePrice || 500,
          categories: selectedCategories,
        });
      }
      
      onClose();
      if (role === 'shop') {
        nav('/shop');
      }
      return;
    }

    // Normal customer login or signup
    await login({
      role,
      name: finalEmail.split('@')[0],
      email: finalEmail,
      password: password || 'password123',
      phone: phone || '+91 98765 43210',
    });
    onClose();
    if (role === 'shop') {
      nav('/shop');
    }
  };

  const isShopSignup = mode === 'signup' && role === 'shop';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'login' ? 'Sign in to Fixly' : 'Create Fixly Account'}
      maxWidth={isShopSignup ? 'max-w-2xl' : 'max-w-md'}
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-full bg-zinc-100 border border-zinc-200">
          {(['customer', 'shop']).map((r) => (
            <motion.button
              key={r}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setRole(r)}
              className={`relative py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                role === r ? 'text-white' : 'text-zinc-700 hover:text-black'
              }`}
            >
              {role === r && (
                <motion.span
                  layoutId="authRoleTab"
                  className={`absolute inset-0 rounded-full ${r === 'shop' ? 'bg-purple-600' : 'bg-blue-600'}`}
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

        {/* Dynamic Form Content */}
        {!isShopSignup ? (
          <>
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
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <Input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Reddy"
                      className="pl-10 text-sm rounded-full bg-white border-zinc-300"
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
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="pl-10 text-sm rounded-full bg-white border-zinc-300"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-10 text-sm rounded-full bg-white border-zinc-300"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 text-sm rounded-full bg-white border-zinc-300"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-8 mt-2">
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-black text-zinc-900 border-b pb-2">Shop Details</h4>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Shop Name *
                </label>
                <div className="relative">
                  <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Apex Electronics"
                    className="pl-10 text-sm rounded-full bg-white border-zinc-300 h-11"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Owner Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="pl-10 text-sm rounded-full bg-white border-zinc-300 h-11"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="pl-10 text-sm rounded-full bg-white border-zinc-300 h-11"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Full Address *
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. #42, 80ft Road, Near Sony Signal"
                    className="pl-10 text-sm rounded-full bg-white border-zinc-300 h-11"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Email & Password *
                </label>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="text-sm rounded-full bg-white border-zinc-300 h-11 w-1/2"
                  />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="text-sm rounded-full bg-white border-zinc-300 h-11 w-1/2"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-black text-zinc-900 border-b pb-2">Services & Quotes</h4>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((c) => {
                  const isSelected = services[c.key] > 0;
                  return (
                    <motion.div
                      key={c.key}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCategory(c.key)}
                      className={`p-3 rounded-2xl cursor-pointer border flex flex-col justify-between transition-colors ${
                        isSelected ? 'bg-purple-50 border-purple-600' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{c.emoji}</span>
                          <span className="text-xs font-bold leading-tight">{c.key}</span>
                        </div>
                        {isSelected && (
                          <div className="size-5 shrink-0 rounded-full bg-purple-600 text-white flex items-center justify-center">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 pt-2 border-t border-purple-200 flex flex-col gap-1"
                        >
                          <span className="text-[10px] font-bold text-purple-900 uppercase">Base (₹)</span>
                          <input
                            type="number"
                            value={services[c.key]}
                            onChange={(e) =>
                              setServices({
                                ...services,
                                [c.key]: Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 text-sm font-bold rounded-lg border border-purple-300 bg-white"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className={`w-full py-3 mt-2 text-sm font-bold text-white rounded-full ${
            role === 'shop' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {mode === 'login' ? `Sign In as ${role === 'shop' ? 'Repair Shop' : 'Customer'}` : (role === 'shop' ? 'Publish Shop & Create Account' : 'Create Free Account')}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          <ShieldCheck size={14} className="text-green-600" />
          <span>Demo mode active · Auto credentials filled</span>
        </div>
      </form>
    </Modal>
  );
}
