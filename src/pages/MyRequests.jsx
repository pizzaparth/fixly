import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Calendar,
  Star,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '../components/Modal';
import { useStore } from '../context/StoreContext';

export function MyRequests() {
  const { orders, rateOrder } = useStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const [ratingTarget, setRatingTarget] = useState(null);
  const [rateForm, setRateForm] = useState({ score: 5, feedback: '' });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const handleRateSubmit = (e) => {
    e.preventDefault();
    if (!ratingTarget) return;

    rateOrder(ratingTarget.id, rateForm.score, '');

    setRatingTarget(null);
    setRateForm({ score: 5, feedback: '' });
    showToast('Your rating has been submitted!');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-black text-white px-5 py-3 rounded-md font-bold text-sm border-2 border-zinc-900 shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={18} className="text-green-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white font-bold">Customer Portal</Badge>
            </div>
            <h1 className="text-3xl font-black text-zinc-950 mt-1 flex items-center gap-2">
              <ClipboardList size={28} className="text-blue-600" />
              <span>My Repair Requests & History</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-medium">
              Track real-time quote updates, drop-off time slots, and technician completion.
            </p>
          </div>

          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md">
              <span>+ New Repair Request</span>
            </Button>
          </Link>
        </div>

        {/* Filter Tabs using Shadcn */}
        <Tabs 
          value={activeFilter} 
          onValueChange={(val) => setActiveFilter(val)} 
          className="w-full mb-6"
        >
          <TabsList className="bg-zinc-100 p-1">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'pending', label: 'Pending Quotes' },
              { key: 'ongoing', label: 'In-Progress' },
              { key: 'completed', label: 'Completed' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.key}
                value={tab.key}
                className="text-xs font-bold uppercase tracking-wider"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Orders List */}
        <div className="flex flex-col gap-4">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-16 p-8 rounded-3xl bg-zinc-50 border border-zinc-200">
              <CardContent className="flex flex-col items-center">
                <div className="size-16 rounded-3xl bg-zinc-200 flex items-center justify-center text-3xl mb-4">
                  📦
                </div>
                <CardTitle className="text-xl font-bold text-zinc-900">
                  No repair requests found
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-md mx-auto font-medium">
                  You haven't placed any repair orders in this category yet. Explore local shops to get started!
                </CardDescription>
                <Link to="/" className="inline-block mt-5">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md">
                    Browse Repair Shops →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <CustomerOrderCard
                key={order.id}
                order={order}
                onOpenRating={() => {
                  setRatingTarget(order);
                  setRateForm({
                    score: order.rating?.score || 5,
                    feedback: order.rating?.feedback || '',
                  });
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Review & Rating Modal */}
      <Modal
        open={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        title="Rate & Review Technician"
        maxWidth="max-w-md"
      >
        {ratingTarget && (
          <form onSubmit={handleRateSubmit} className="flex flex-col gap-4">
            <div className="p-3 rounded-md bg-zinc-50 border border-zinc-200">
              <p className="text-xs font-bold text-zinc-900">{ratingTarget.shopName}</p>
              <p className="text-xs text-zinc-600 mt-0.5">
                {ratingTarget.item} repair · ₹{ratingTarget.price}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5 p-3 rounded-md bg-zinc-50 border border-zinc-200">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wide">
                Your Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRateForm({ ...rateForm, score: star })}
                    className="cursor-pointer"
                  >
                    <Star
                      size={28}
                      className={
                        star <= rateForm.score
                          ? 'fill-yellow-400 text-yellow-500'
                          : 'text-zinc-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold rounded-full">
              Submit Rating
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

function CustomerOrderCard({ order, onOpenRating }) {
  const catMeta = CATEGORIES.find((c) => c.key === order.item);

  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 rounded-3xl bg-white border-2 border-zinc-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          <div className="size-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shrink-0 shadow-sm">
            {catMeta?.emoji || '🔧'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg font-black text-zinc-950">
                {order.item} Repair
              </CardTitle>
              <span className="text-sm font-black text-zinc-900">
                Quoted: ₹{order.price}
              </span>
            </div>

            <p className="text-xs text-zinc-700 mt-1 font-medium">
              <strong>Issue:</strong> {order.issue}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                <span>🏪 Shop:</span>
                <span className="text-zinc-950">{order.shopName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <span>🕒 Requested:</span>
                <span>{order.requestedAt}</span>
              </div>
              {order.pickupAt && (
                <div className="flex items-center gap-1.5 text-blue-700 font-bold sm:col-span-2">
                  <Calendar size={13} />
                  <span>Drop-off / Pickup Window: {order.pickupAt}</span>
                </div>
              )}
              {order.completionAt && (
                <div className="flex items-center gap-1.5 text-green-700 font-bold sm:col-span-2">
                  <CheckCircle2 size={13} />
                  <span>Completed on: {order.completionAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status & Review CTA */}
        <div className="flex flex-col items-start md:items-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-200">
          {order.status === 'pending' && (
            <Badge className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black h-8 px-4 text-[13px] shadow-sm border-transparent">
              ⏳ Awaiting technician quote
            </Badge>
          )}

          {order.status === 'ongoing' && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-black h-8 px-4 text-[13px] shadow-sm border-transparent">
              🔧 Repair in progress
            </Badge>
          )}

          {order.status === 'completed' && (
            <div className="flex flex-col md:items-end gap-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-black h-8 px-4 text-[13px] shadow-sm border-transparent flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>Repair Completed</span>
              </Badge>
              {order.rating ? (
                <div className="flex items-center gap-1.5 p-2 rounded-sm bg-zinc-50 border border-zinc-200">
                  <span className="text-[11px] font-bold text-zinc-700">Your Rating:</span>
                  <Stars rating={order.rating.score} size={12} />
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={onOpenRating}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold rounded-full"
                >
                  <Star size={13} />
                  <span>Rate & Review Technician</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
