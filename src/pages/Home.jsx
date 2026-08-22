import React, { useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  ArrowRight,
  X,
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
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
  const searchInputRef = useRef(null);

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
      {/* 1. Hero Section */}
      <section className="bg-white pt-10 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
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

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 22 }}
            className="w-full max-w-4xl mx-auto mt-10 mb-2"
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-4 text-left">Find a repair shop near you</h3>
            <div className="h-64 sm:h-80 w-full rounded-3xl overflow-hidden border-2 border-zinc-900 shadow-sm relative z-0">
              <MapContainer 
                center={[12.9716, 77.5946]} 
                zoom={12} 
                scrollWheelZoom={true}
                dragging={true}
                attributionControl={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  detectRetina={true}
                />
                {/* Hardcoded Red Circles for locations in Bengaluru */}
                {[
                  [12.9783, 77.6408], // Indiranagar
                  [12.9298, 77.5844], // Jayanagar
                  [12.9345, 77.6265], // Koramangala
                  [12.9696, 77.7500], // Whitefield
                  [12.9121, 77.6446], // HSR Layout
                  [12.9915, 77.5927], // Vasanth Nagar
                  [12.9279, 77.6271], // BTM Layout
                  [12.9856, 77.5225], // Rajajinagar
                  [13.0280, 77.5409], // Yeshwanthpur
                  [12.8913, 77.5840], // JP Nagar
                  [12.9591, 77.7319], // Marathahalli
                  [12.9983, 77.5533], // Malleshwaram
                ].map((pos, idx) => (
                  <CircleMarker 
                    key={idx} 
                    center={pos} 
                    radius={12}
                    pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.5, weight: 2 }}
                  />
                ))}
              </MapContainer>
            </div>
          </motion.div>

          {/* Horizontally Expanding Search Bar on Click/Focus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex justify-center w-full px-2"
          >
            <motion.div
              layout
              animate={{
                maxWidth: isFocused || query ? '860px' : '440px',
                boxShadow: isFocused
                  ? '0 20px 35px -5px rgba(0, 0, 0, 0.12), 0 0 0 2px #2563eb'
                  : '0 4px 14px 0 rgba(0, 0, 0, 0.06)',
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 25 }}
              onClick={() => searchInputRef.current?.focus()}
              className="w-full bg-white border-2 border-zinc-900 rounded-full py-2.5 px-4 flex items-center gap-3 cursor-text transition-colors"
            >
              <motion.div
                animate={{
                  scale: isFocused ? 1.08 : 1,
                  rotate: isFocused ? 90 : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className={`size-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isFocused ? 'bg-blue-600 text-white' : 'bg-zinc-950 text-white'
                }`}
              >
                <Search size={18} />
              </motion.div>
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  isFocused
                    ? 'Search by model, shop name, or issue (e.g. MacBook screen, AC gas, iPhone battery)...'
                    : 'Search repair shops or appliances...'
                }
                className="w-full text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent outline-none font-medium"
              />
              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1.5 text-zinc-400 hover:text-black rounded-full cursor-pointer hover:bg-zinc-100"
                >
                  <X size={18} />
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Fully Rounded Category Filter Chips */}
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

      {/* 2. Search & Active Filter Results (Full-width vertical stack) */}
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
                className="rounded-full border-zinc-900 text-xs font-bold px-4"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {filteredShops.length === 0 ? (
            <Card className="text-center py-16 p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
              <CardContent className="flex flex-col items-center">
                <div className="size-16 rounded-full bg-zinc-200 flex items-center justify-center text-3xl mb-4">
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
            <div className="flex flex-col gap-5 w-full">
              {filteredShops.map((shop, i) => (
                <FullWidthShopCard
                  key={shop.id}
                  shop={shop}
                  index={i}
                  activeCategory={activeCategory}
                  onOpen={() => setActiveShopModalId(shop.id)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Category Grouped Sections (When not searching - Full width vertical stack) */}
      {!query && activeCategory === 'All' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 space-y-12">
          {Array.from(groupedShops.entries()).map(([catKey, shopList], idx) => {
            const catMeta = CATEGORIES.find((c) => c.key === catKey);
            return (
              <div key={catKey} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="size-10 rounded-2xl bg-zinc-100 border border-zinc-300 flex items-center justify-center text-2xl shadow-xs">
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
                    className="text-xs font-bold text-zinc-700 hover:text-black rounded-full"
                  >
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>

                {/* Vertical Stack of Full-Width Cards */}
                <div className="flex flex-col gap-4 w-full">
                  {shopList.map((shop, i) => (
                    <FullWidthShopCard
                      key={shop.id}
                      shop={shop}
                      index={idx * 3 + i}
                      activeCategory={activeCategory}
                      onOpen={() => setActiveShopModalId(shop.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

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
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 cursor-pointer transition-colors ${
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

function FullWidthShopCard({ shop, index, activeCategory, onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: (index % 4) * 0.05, type: 'spring', stiffness: 220, damping: 22 }}
      whileHover={{ y: -3 }}
      className="w-full"
    >
      <Card className="w-full rounded-3xl bg-white border-2 border-zinc-900 shadow-sm hover:shadow-md transition-all overflow-hidden p-0">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left info & avatar */}
          <div className="flex items-start gap-5 min-w-0">
            <div className="size-16 sm:size-20 rounded-2xl bg-blue-600 flex items-center justify-center text-4xl sm:text-5xl text-white font-bold shrink-0 shadow-sm">
              {shop.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <CardTitle className="text-xl sm:text-2xl font-black text-zinc-950 truncate">
                  {shop.name}
                </CardTitle>
                <Badge className="bg-purple-600 text-white font-bold rounded-full px-3 text-[11px]">
                  Verified Shop
                </Badge>
              </div>

              <CardDescription className="text-sm text-zinc-600 font-semibold mt-1">
                {shop.owner} · <span className="text-zinc-500 font-normal">{shop.address}</span>
              </CardDescription>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-zinc-600">
                <div className="flex items-center gap-1 text-blue-600 font-bold">
                  <MapPin size={14} className="shrink-0" />
                  <span>{shop.distanceKm} km away</span>
                </div>
                <span>•</span>
                <Stars rating={shop.rating} size={15} count={shop.reviewCount} />
              </div>

              {/* Supported Category Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {shop.categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="text-xs py-1 px-3 bg-zinc-100 border-zinc-300 text-zinc-800 rounded-full font-semibold"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right action & price block */}
          <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-200">
            <div className="flex-1 text-right">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                {activeCategory !== 'All' && shop.categories.includes(activeCategory) ? `${activeCategory} Base` : 'Est. Base'}
              </span>
              <span className="text-lg font-black text-zinc-950 block leading-none mt-1">
                ~₹{(activeCategory !== 'All' ? shop.servicePrices?.[activeCategory] : null) || shop.estCost}
              </span>
            </div>

            <Button
              onClick={onOpen}
              className="bg-black hover:bg-zinc-800 text-white text-sm font-bold uppercase tracking-wider rounded-full px-6 py-2.5 shadow-sm"
            >
              <span>View Profile & Book</span>
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
