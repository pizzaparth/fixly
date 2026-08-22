import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Store, ShieldCheck, Mail, Lock, Phone, Check, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AuthModal({ open, onClose }) {
  const { login, registerUser, addShop } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('customer');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (mode === 'signup' && role === 'shop') {
      if (!shopName.trim()) newErrors.shopName = true;
      if (!name.trim()) newErrors.name = true;
      if (!phone.trim()) newErrors.phone = true;
      if (!address.trim()) newErrors.address = true;
      if (!email.trim()) newErrors.email = true;
      if (!password) newErrors.password = true;
    } else if (mode === 'signup') {
      if (!name.trim()) newErrors.name = true;
      if (!email.trim()) newErrors.email = true;
      if (!password) newErrors.password = true;
    } else {
      if (!email.trim()) newErrors.email = true;
      if (!password) newErrors.password = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    try {
      if (mode === 'signup' && role === 'shop') {
        const user = await registerUser({
          role: 'shop',
          name,
          email,
          password,
          phone,
          specialties: [],
        });

        if (user) {
          await addShop({
            technicianId: user.id,
            name: shopName,
            owner: name,
            mobile: phone,
            address: `${address}, ${city}`,
            estCost: 500,
            categories: [],
          });
        }
        
        onClose();
        nav('/shop');
        return;
      }

      if (mode === 'signup') {
        await registerUser({
          role,
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone || '+91 00000 00000',
        });
      } else {
        await login({
          role,
          email: email.trim(),
          password,
        });
      }

      onClose();
      if (role === 'shop') {
        nav('/shop');
      }
    } catch (error) {
      setErrors({ auth: error.message || 'Authentication failed' });
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Reddy"
                      className={`pl-10 text-sm rounded-full bg-white border ${errors.name ? 'border-red-500' : 'border-zinc-300'}`}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className={`pl-10 text-sm rounded-full bg-white border ${errors.email ? 'border-red-500' : 'border-zinc-300'}`}
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
                    className={`pl-10 text-sm rounded-full bg-white border border-zinc-300`}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 text-sm rounded-full bg-white border ${errors.password ? 'border-red-500' : 'border-zinc-300'}`}
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
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Apex Electronics"
                    className={`pl-10 text-sm rounded-full bg-white border h-11 ${errors.shopName ? 'border-red-500' : 'border-zinc-300'}`}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className={`pl-10 text-sm rounded-full bg-white border h-11 ${errors.name ? 'border-red-500' : 'border-zinc-300'}`}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className={`pl-10 text-sm rounded-full bg-white border h-11 ${errors.phone ? 'border-red-500' : 'border-zinc-300'}`}
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. #42, 80ft Road, Near Sony Signal"
                    className={`pl-10 text-sm rounded-full bg-white border h-11 ${errors.address ? 'border-red-500' : 'border-zinc-300'}`}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={`text-sm rounded-full bg-white border h-11 w-1/2 ${errors.email ? 'border-red-500' : 'border-zinc-300'}`}
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`text-sm rounded-full bg-white border h-11 w-1/2 ${errors.password ? 'border-red-500' : 'border-zinc-300'}`}
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {errors.auth && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center">
            {errors.auth}
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

      </form>
    </Modal>
  );
}
