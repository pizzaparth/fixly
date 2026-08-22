import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from './Modal';
import { Stars } from './ui-custom';
import {
  Phone,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Star,
  User,
  CheckCircle2,
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';

export function ShopModal({
  shopId,
  onClose,
}) {
  const {
    shops,
    session,
    setAuthModalOpen,
    createOrder,
    addFeedback,
    addRating,
  } = useStore();

  const shop = useMemo(
    () => shops.find((s) => s.id === shopId) ?? null,
    [shops, shopId]
  );

  // Sub-modal states
  const [orderOpen, setOrderOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rateOpen, setRateOpen] = useState(false);

  // Form states
  const [orderForm, setOrderForm] = useState({
    item: '',
    productName: '',
    issue: '',
    customerName: '',
    mobile: '',
    address: '',
    pickupAt: '',
  });

  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, text: '' });
  const [rateValue, setRateValue] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  if (!shop) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const requireAuth = (callback) => {
    if (!session) {
      setAuthModalOpen(true);
      return;
    }
    callback();
  };

  // 1. Submit Repair Order
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.item || !orderForm.productName || !orderForm.mobile) return;

    createOrder({
      customerName: orderForm.customerName || session?.name || 'Customer',
      customerEmail: session?.email || 'customer@fixly.local',
      mobile: orderForm.mobile,
      address: orderForm.address || 'Drop-off at shop',
      item: orderForm.item,
      issue: `${orderForm.productName} - ${orderForm.issue}`,
      shopId: shop.id,
      price: shop.estCost,
      pickupAt: orderForm.pickupAt,
    });

    setOrderOpen(false);
    setOrderForm({
      item: '',
      productName: '',
      issue: '',
      customerName: '',
      mobile: '',
      address: '',
      pickupAt: '',
    });
    showToast(`Repair request submitted to ${shop.name}!`);
  };

  // 2. Submit Feedback
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackForm.text.trim()) return;

    addFeedback(shop.id, {
      author: session?.name || 'Verified Customer',
      rating: feedbackForm.rating,
      text: feedbackForm.text,
    });

    setFeedbackOpen(false);
    setFeedbackForm({ rating: 5, text: '' });
    showToast('Thank you! Your feedback has been published.');
  };

  // 3. Submit Rating
  const handleRatingSubmit = () => {
    if (rateValue === 0) return;
    addRating(shop.id, rateValue);
    setRateOpen(false);
    setRateValue(0);
    showToast('Your rating was submitted successfully!');
  };

  return (
    <>
      {/* Toast Notification */}
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

      {/* Main Shop Profile Modal */}
      <Modal open={true} onClose={onClose} title={shop.name} maxWidth="max-w-3xl">
        <div className="flex flex-col gap-6">
          {/* Header Card */}
          <Card className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-md bg-zinc-50 border border-zinc-200 shadow-none">
            <div className="size-20 rounded-md bg-blue-600 flex items-center justify-center text-4xl text-white shadow-sm shrink-0 font-bold">
              {shop.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl font-black text-zinc-950">{shop.name}</CardTitle>
                <Badge className="bg-purple-600 text-white font-bold">Verified Expert</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 text-xs text-zinc-600">
                <p className="flex items-center gap-1.5 font-medium">
                  <User size={14} className="text-zinc-500 shrink-0" />
                  <span>Owner: <strong className="text-zinc-900">{shop.owner}</strong></span>
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <Phone size={14} className="text-zinc-500 shrink-0" />
                  <span>{shop.mobile}</span>
                </p>
                <p className="flex items-center gap-1.5 font-medium sm:col-span-2">
                  <MapPin size={14} className="text-blue-600 shrink-0" />
                  <span>{shop.address} ({shop.distanceKm} km away)</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 rounded-md bg-white border border-zinc-200 text-center shadow-none">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Avg. Estimate
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5 block">
                ₹{shop.estCost}
              </span>
            </Card>
            <Card className="p-3 rounded-md bg-white border border-zinc-200 text-center shadow-none">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Shop Rating
              </span>
              <div className="flex justify-center mt-1">
                <Stars rating={shop.rating} size={16} count={shop.reviewCount} />
              </div>
            </Card>
            <Card className="p-3 rounded-md bg-white border border-zinc-200 text-center shadow-none">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Turnaround
              </span>
              <span className="text-sm sm:text-base font-bold text-zinc-900 mt-1 block">
                Same/Next Day
              </span>
            </Card>
          </div>

          {/* Supported Categories */}
          <div>
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-2">
              Supported Repair Categories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {shop.categories.map((c) => {
                const meta = CATEGORIES.find((cat) => cat.key === c);
                return (
                  <Badge
                    key={c}
                    variant="outline"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border-zinc-300 text-xs font-bold text-zinc-900"
                  >
                    <span>{meta?.emoji || '🔧'}</span>
                    <span>{c}</span>
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-200">
            <Button
              onClick={() => requireAuth(() => setOrderOpen(true))}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
            >
              <ShoppingBag size={16} />
              <span>Order Repair</span>
            </Button>
            <Button
              onClick={() => requireAuth(() => setFeedbackOpen(true))}
              className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-md"
            >
              <MessageCircle size={16} />
              <span>Write Feedback</span>
            </Button>
            <Button
              onClick={() => requireAuth(() => setRateOpen(true))}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-md"
            >
              <Star size={16} />
              <span>Rate Shop</span>
            </Button>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-zinc-200 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-bold text-zinc-950">
                Customer Reviews ({shop.feedback?.length || 0})
              </h4>
              <Stars rating={shop.rating} size={14} />
            </div>

            <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
              {(!shop.feedback || shop.feedback.length === 0) && (
                <p className="text-xs text-zinc-500 py-4 text-center">
                  No reviews yet. Be the first to review this repair shop!
                </p>
              )}
              {shop.feedback?.map((f, i) => (
                <Card
                  key={f.id || i}
                  className="p-3 rounded-md bg-zinc-50 border border-zinc-200 flex flex-col gap-1 shadow-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">{f.author}</span>
                    <Stars rating={f.rating} size={12} />
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">{f.text}</p>
                  <span className="text-[10px] text-zinc-400 font-medium">{f.date}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Sub-Modal 1: Order Repair */}
      <Modal
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        title={`Request Repair from ${shop.name}`}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleOrderSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
              Product Category *
            </label>
            <select
              required
              value={orderForm.item}
              onChange={(e) => setOrderForm({ ...orderForm, item: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="">Select a category...</option>
              {shop.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
              Product Model / Device Name *
            </label>
            <Input
              type="text"
              required
              value={orderForm.productName}
              onChange={(e) => setOrderForm({ ...orderForm, productName: e.target.value })}
              placeholder="e.g. MacBook Pro M1 2020 / Samsung 55' Smart TV"
              className="text-sm rounded-md bg-white border-zinc-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
              Describe Issue *
            </label>
            <Textarea
              required
              rows={2}
              value={orderForm.issue}
              onChange={(e) => setOrderForm({ ...orderForm, issue: e.target.value })}
              placeholder="What seems to be broken or malfunctioning?"
              className="text-sm rounded-md bg-white border-zinc-300 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Your Contact Number *
              </label>
              <Input
                type="tel"
                required
                value={orderForm.mobile}
                onChange={(e) => setOrderForm({ ...orderForm, mobile: e.target.value })}
                placeholder="+91 98220 11234"
                className="text-sm rounded-md bg-white border-zinc-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Preferred Drop-off Date
              </label>
              <Input
                type="date"
                value={orderForm.pickupAt}
                onChange={(e) => setOrderForm({ ...orderForm, pickupAt: e.target.value })}
                className="text-sm rounded-md bg-white border-zinc-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
              Your Location / Address
            </label>
            <Input
              type="text"
              value={orderForm.address}
              onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
              placeholder="e.g. Indiranagar, Bengaluru"
              className="text-sm rounded-md bg-white border-zinc-300"
            />
          </div>

          <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-xs text-blue-900">
            <p className="font-semibold">Estimated Base Cost: ₹{shop.estCost}</p>
            <p className="text-[11px] text-blue-700 mt-0.5">
              The technician will verify the item and confirm the exact quote upon request acceptance.
            </p>
          </div>

          <Button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md mt-1">
            Submit Repair Request
          </Button>
        </form>
      </Modal>

      {/* Sub-Modal 2: Write Feedback */}
      <Modal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        title="Share Your Feedback"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-md bg-zinc-50 border border-zinc-200">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-wide">
              Rating
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                  className="cursor-pointer"
                >
                  <Star
                    size={30}
                    className={
                      star <= feedbackForm.rating
                        ? 'fill-yellow-400 text-yellow-500'
                        : 'text-zinc-300'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
              Review Comment *
            </label>
            <Textarea
              required
              rows={4}
              value={feedbackForm.text}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, text: e.target.value })}
              placeholder="Describe your repair experience, speed, and communication…"
              className="text-sm rounded-md bg-white border-zinc-300 resize-none"
            />
          </div>

          <Button type="submit" className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-md">
            Publish Review
          </Button>
        </form>
      </Modal>

      {/* Sub-Modal 3: Rate Shop Quick */}
      <Modal
        open={rateOpen}
        onClose={() => setRateOpen(false)}
        title={`Rate ${shop.name}`}
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-wide">
            Tap a star to rate
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRateValue(star)}
                className="cursor-pointer"
              >
                <Star
                  size={36}
                  className={
                    star <= rateValue
                      ? 'fill-yellow-400 text-yellow-500'
                      : 'text-zinc-300'
                  }
                />
              </button>
            ))}
          </div>

          <Button
            onClick={handleRatingSubmit}
            disabled={rateValue === 0}
            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-md"
          >
            Submit {rateValue > 0 ? `${rateValue}-Star` : ''} Rating
          </Button>
        </div>
      </Modal>
    </>
  );
}
