import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Leaf,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { Stars } from '../components/ui-custom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShopModal } from '../components/ShopModal';
import { useStore } from '../context/StoreContext';

export function Home() {
  const { shops, activeShopModalId, setActiveShopModalId } = useStore();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFocused, setIsFocused] = useState(false);

  // Filtered shops based on search query and category
  const filteredShops = useMemo(() => {
    return shops.filter((s) => {
      const matchCat =
        activeCategory === 'All' || s.categories.includes(activeCategory);
      const matchQuery =
        !query.trim() ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.owner.toLowerCase().includes(query.toLowerCase()) ||
        s.address.toLowerCase().includes(query.toLowerCase()) ||
        s.categories.some((c) =>
          c.toLowerCase().includes(query.toLowerCase())
        );
      return matchCat && matchQuery;
    });
  }, [shops, query, activeCategory]);

  // Grouped shops by category when not searching
  const groupedShops = useMemo(() => {
    const map = new Map();
    for (const cat of CATEGORIES) {
      const matched = shops.filter((s) => s.categories.includes(cat.key));
      if (matched.length > 0) {
        map.set(cat.key, matched);
      }
    }
    return map;
  }, [shops]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* 1. Hero Section (No page breaker bottom border) */}
      <section className="bg-white pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-black text-white text-xs font-bold uppercase tracking-wider mb-5"
          >
            <Leaf size={14} className="text-green-400" />
            <span>Fix It, Don't Replace It · Sustainable Local Repairs</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, type: 'spring', stiffness: 200, damping: 22 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.1]"
          >
            Got a broken gadget?
            <br />
            <span className="text-blue-600">Fix it with Fixly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 22 }}
            className="mt-4 text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto font-medium"
          >
            Discover verified nearby technicians, receive upfront quotes, and track
            your item repair lifecycle with zero platform fees.
          </motion.p>

          {/* Expanding Search Bar with Spring Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex justify-center"
          >
            <motion.div
              animate={{ width: isFocused ? '100%' : '90%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="max-w-2xl w-full bg-white border-2 border-zinc-900 rounded-md shadow-md p-2 flex items-center gap-3"
            >
              <div className="size-9 rounded-sm bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Search size={18} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search by product, shop name, or issue (Laptop, AC, Screen...)"
                className="w-full text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-zinc-400 hover:text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </motion.div>
          </motion.div>

          {/* Category Filter Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
          >
            <CategoryChip
              label="All Items"
              emoji="✨"
              active={activeCategory === 'All'}
              onClick={() => setActiveCategory('All')}
            />
            {CATEGORIES.map((c) => (
              <CategoryChip
                key={c.key}
                label={c.key}
                emoji={c.emoji}
                active={activeCategory === c.key}
                onClick={() => setActiveCategory(c.key)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Search & Active Filter Results */}
      {(query || activeCategory !== 'All') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-zinc-950">
                Available Repair Specialists
              </h2>
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider mt-1">
                Showing {filteredShops.length} matching shop{filteredShops.length !== 1 ? 's' : ''}
              </p>
            </div>
            {(query || activeCategory !== 'All') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('All');
                }}
                className="rounded-md border-zinc-900 text-xs font-bold"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {filteredShops.length === 0 ? (
            <Card className="text-center py-16 p-8 rounded-md bg-zinc-50 border border-zinc-200">
              <CardContent className="flex flex-col items-center">
                <div className="size-16 rounded-md bg-zinc-200 flex items-center justify-center text-3xl mb-4">
                  🔍
                </div>
                <CardTitle className="text-xl font-bold text-zinc-900">
                  No repair shops match your query
                </CardTitle>
                <CardDescription className="text-sm text-zinc-600 mt-1 max-w-md mx-auto">
                  Try searching for a different appliance category or clear your search filters.
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop, i) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  index={i}
                  onOpen={() => setActiveShopModalId(shop.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Category Grouped Sections (When not searching) */}
      {!query && activeCategory === 'All' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 space-y-12">
          {Array.from(groupedShops.entries()).map(([catKey, shopList], idx) => {
            const catMeta = CATEGORIES.find((c) => c.key === catKey);
            return (
              <div key={catKey} className="border-b border-zinc-100 pb-10 last:border-b-0">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="size-10 rounded-md bg-zinc-100 border border-zinc-300 flex items-center justify-center text-2xl">
                      {catMeta?.emoji || '🔧'}
                    </span>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                        {catKey} Repairs Near You
                      </h2>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        {shopList.length} verified technician{shopList.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory(catKey)}
                    className="text-xs font-bold text-zinc-700 hover:text-black"
                  >
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopList.map((shop, i) => (
                    <ShopCard
                      key={shop.id}
                      shop={shop}
                      index={idx * 3 + i}
                      onOpen={() => setActiveShopModalId(shop.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 4. Value Proposition Blocks using shadcn Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Card className="rounded-md bg-zinc-950 text-white p-8 sm:p-12 border-2 border-black">
          <div className="max-w-2xl mb-8">
            <Badge className="mb-3 bg-yellow-400 text-black border-yellow-500 font-bold">
              Why Fixly?
            </Badge>
            <CardTitle className="text-3xl font-black tracking-tight text-white">
              Built for transparent repairs & local economy.
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-2 text-sm sm:text-base font-medium">
              We empower consumers to repair electronics cost-effectively while connecting local technicians directly without intermediary cuts.
            </CardDescription>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<Zap size={22} className="text-blue-400" />}
              title="Transparent Quotes"
              desc="Technicians inspect requests and send exact fixed prices and pickup timelines upfront."
            />
            <ValueCard
              icon={<ShieldCheck size={22} className="text-purple-400" />}
              title="Verified Technicians"
              desc="Explore genuine customer ratings, turnaround stats, and verified repair specializations."
            />
            <ValueCard
              icon={<DollarSign size={22} className="text-green-400" />}
              title="Zero Middleman Fee"
              desc="Pay the technician directly upon repair completion. No hidden commission charges."
            />
            <ValueCard
              icon={<Leaf size={22} className="text-yellow-400" />}
              title="Cut E-Waste"
              desc="Every repaired gadget saves money and keeps hazardous materials out of landfills."
            />
          </div>
        </Card>
      </section>

      {/* Active Shop Profile Modal */}
      {activeShopModalId && (
        <ShopModal
          shopId={activeShopModalId}
          onClose={() => setActiveShopModalId(null)}
        />
      )}
    </div>
  );
}

function CategoryChip({ label, emoji, active, onClick }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider border-2 cursor-pointer transition-colors ${
        active
          ? 'bg-black text-white border-black shadow-sm'
          : 'bg-white text-zinc-800 border-zinc-300 hover:border-black'
      }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}

function ShopCard({ shop, index, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: (index % 6) * 0.05, type: 'spring', stiffness: 220, damping: 22 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full rounded-md bg-white border-2 border-zinc-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden text-left p-0">
        {/* Header banner */}
        <CardHeader className="p-5 border-b border-zinc-200 bg-zinc-50 flex flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-14 rounded-md bg-blue-600 flex items-center justify-center text-3xl text-white font-bold shrink-0 shadow-sm">
              {shop.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-black text-zinc-950 truncate">
                {shop.name}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-bold uppercase tracking-wider truncate mt-0.5">
                {shop.owner}
              </CardDescription>
              <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <MapPin size={13} className="shrink-0" />
                <span>{shop.distanceKm} km away</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Body Content */}
        <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Estimated Cost
              </span>
              <span className="text-xl font-black text-zinc-950 block">
                ~₹{shop.estCost}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Rating
              </span>
              <div className="mt-0.5">
                <Stars rating={shop.rating} size={14} count={shop.reviewCount} />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {shop.categories.slice(0, 3).map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-[10px] py-0.5 bg-zinc-100 border-zinc-300 text-zinc-800"
              >
                {cat}
              </Badge>
            ))}
            {shop.categories.length > 3 && (
              <Badge
                className="text-[10px] py-0.5 bg-purple-600 text-white font-bold"
              >
                +{shop.categories.length - 3} more
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            onClick={onOpen}
            className="w-full py-2 bg-black text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider mt-1 rounded-md"
          >
            <span>View Profile & Book</span>
            <ArrowRight size={14} />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <Card className="p-4 rounded-md bg-zinc-900 border border-zinc-800 flex flex-col gap-2 shadow-none">
      <div className="size-10 rounded-sm bg-zinc-800 flex items-center justify-center mb-1">
        {icon}
      </div>
      <CardTitle className="text-base font-bold text-white">{title}</CardTitle>
      <CardDescription className="text-xs text-zinc-400 leading-relaxed font-normal">
        {desc}
      </CardDescription>
    </Card>
  );
}
