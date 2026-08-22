import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/mockData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function ShopOnboard() {
  const nav = useNavigate();
  const { addShop, login } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    mobile: '',
    address: '',
    city: 'Bengaluru',
  });

  const [services, setServices] = useState(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]))
  );

  const toggleCategory = (catKey) => {
    setServices((prev) => ({
      ...prev,
      [catKey]: prev[catKey] === 0 ? 500 : 0,
    }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.owner.trim() || !formData.mobile.trim()) {
      alert('Please fill out all required shop details.');
      return;
    }

    const selectedCategories = Object.keys(services).filter((k) => services[k] > 0);
    if (selectedCategories.length === 0) {
      alert('Please select at least one repair service category.');
      return;
    }

    const basePrice = Math.min(...selectedCategories.map((k) => services[k]));

    const newShop = addShop({
      name: formData.name,
      owner: formData.owner,
      mobile: formData.mobile,
      address: `${formData.address}, ${formData.city}`,
      estCost: basePrice || 500,
      categories: selectedCategories,
      emoji: '🔧',
    });

    login({
      role: 'shop',
      name: formData.owner,
      email: `${formData.name.toLowerCase().replace(/\s+/g, '')}@fixly.local`,
      phone: formData.mobile,
      shopId: newShop.id,
    });

    nav('/shop');
  };

  const activeCount = Object.values(services).filter((val) => val > 0).length;

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-zinc-200 pb-6 mb-8">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white font-bold rounded-full">Partner Network</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 mt-2 flex items-center gap-3">
            <Store size={32} className="text-purple-600" />
            <span>List Your Repair Shop</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 mt-2 font-medium">
            Join Fixly to connect with customers in your neighborhood, receive repair requests, and set your own transparent prices.
          </p>
        </div>

        <form onSubmit={handlePublish} className="flex flex-col gap-8">
          <Card className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-zinc-900 shadow-sm">
            <CardHeader className="p-0 mb-5">
              <CardTitle className="text-lg font-black text-zinc-950 flex items-center gap-2">
                <span className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Shop & Contact Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Shop / Business Name *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Electronics & Mobile Care"
                  className="rounded-full px-4 py-2 bg-white border-zinc-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Owner / Master Technician *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="rounded-full px-4 py-2 bg-white border-zinc-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Business Mobile Number *
                </label>
                <Input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 98450 12345"
                  className="rounded-full px-4 py-2 bg-white border-zinc-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  City / Region
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-full px-4 py-2 bg-white border-zinc-300"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Full Shop Address / Landmark *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. #42, 80ft Road, Near Sony Signal, Koramangala"
                  className="rounded-full px-4 py-2 bg-white border-zinc-300"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-zinc-900 shadow-sm">
            <CardHeader className="p-0 border-b border-zinc-200 pb-3 mb-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black text-zinc-950 flex items-center gap-2">
                  <span className="size-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <span>Select Repaired Items & Base Prices</span>
                </CardTitle>
                <Badge className="bg-blue-600 text-white font-bold rounded-full">
                  {activeCount} selected
                </Badge>
              </div>
              <CardDescription className="text-xs text-zinc-600 mt-2 font-medium">
                Click on the categories your shop repairs and specify your starting base estimate for diagnostics or typical servicing.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CATEGORIES.map((c) => {
                const isSelected = services[c.key] > 0;
                return (
                  <motion.div
                    key={c.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCategory(c.key)}
                    className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 shadow-sm'
                        : 'bg-zinc-50 border-zinc-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="text-sm font-bold text-zinc-950">{c.key}</span>
                      </div>
                      {isSelected && (
                        <div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          <Check size={14} />
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 pt-2 border-t border-blue-200 flex items-center justify-between gap-2"
                      >
                        <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                          Base Quote (₹):
                        </span>
                        <input
                          type="number"
                          value={services[c.key]}
                          onChange={(e) =>
                            setServices({
                              ...services,
                              [c.key]: Number(e.target.value),
                            })
                          }
                          className="w-20 px-3 py-1 text-xs font-bold rounded-full border-2 border-blue-600 bg-white text-right"
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          <div className="p-4 rounded-2xl bg-green-50 border-2 border-green-600 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className="text-green-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-green-950 uppercase tracking-wider">
                  Direct Payment Promise
                </p>
                <p className="text-xs text-green-800 font-medium">
                  Fixly collects 0% commission fees. Customers pay you directly via Cash, UPI, or Card upon collection.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-sm rounded-full shadow-sm"
            >
              <span>Publish Shop & Launch Hub</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
