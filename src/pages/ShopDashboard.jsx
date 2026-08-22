import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Clock,
  Wrench,
  CheckCircle2,
  Check,
  X,
  Pencil,
  TrendingUp,
  Store,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  IndianRupee,
  User,
  ShieldCheck,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { SolidButton, SolidBadge, Stars } from '../components/ui-custom';
import { Modal } from '../components/Modal';
import { useStore } from '../context/StoreContext';

export function ShopDashboard() {
  const {
    session,
    shops,
    orders,
    acceptOrder,
    rejectOrder,
    completeOrder,
    setAuthModalOpen,
  } = useStore();

  // Find active technician's shop or fallback to first shop
  const activeShop = shops[0] || {
    id: 's1',
    name: 'BrewByte Repairs',
    owner: 'Arjun Mehta',
    mobile: '+91 98220 11234',
    address: '12, Cafe Lane, Indiranagar, Bengaluru',
    rating: 4.7,
    reviewCount: 128,
    estCost: 650,
    categories: ['Laptop', 'Mobile', 'Charger', 'Information Cables'],
    emoji: '💻',
  };

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'ongoing' | 'completed'
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [acceptForm, setAcceptForm] = useState({
    pickup: '',
    complete: '',
    price: '',
    notes: '',
  });

  const [services, setServices] = useState(() =>
    Object.fromEntries(
      (activeShop.categories || []).map((c) => [c, activeShop.estCost || 500])
    )
  );
  const [editingCategory, setEditingCategory] = useState(null);

  // Counts and Earnings
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const ongoingOrders = orders.filter((o) => o.status === 'ongoing');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const totalEarnings = completedOrders.reduce(
    (sum, o) => sum + (Number(o.price) || 0),
    0
  );

  const displayedOrders = orders.filter((o) => o.status === activeTab);

  // Accept Handler
  const handleAcceptConfirm = (e) => {
    e.preventDefault();
    if (!acceptTarget) return;

    acceptOrder(acceptTarget.id, {
      pickupAt: acceptForm.pickup || 'Today, Drop-off requested',
      completionAt: acceptForm.complete || 'Tomorrow, 06:00 PM',
      price: acceptForm.price ? Number(acceptForm.price) : acceptTarget.price,
    });

    setAcceptTarget(null);
    setAcceptForm({ pickup: '', complete: '', price: '', notes: '' });
    setActiveTab('ongoing');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-md bg-zinc-50 border-2 border-zinc-900 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-md bg-purple-600 flex items-center justify-center text-4xl text-white font-black shrink-0 shadow-sm">
              {activeShop.emoji || '🔧'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-zinc-950">{activeShop.name}</h1>
                <SolidBadge variant="purple">Technician Console</SolidBadge>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-600 font-medium">
                <span className="flex items-center gap-1">
                  <User size={13} className="text-zinc-400" />
                  {activeShop.owner}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-zinc-400" />
                  {activeShop.mobile}
                </span>
                <span>•</span>
                <Stars rating={activeShop.rating} size={13} count={activeShop.reviewCount} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md bg-zinc-950 text-white flex items-center gap-4 border border-black shrink-0">
            <div className="size-11 rounded-sm bg-green-600 flex items-center justify-center text-white font-bold">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Total Direct Earnings
              </span>
              <span className="text-2xl font-black text-white block mt-0.5">
                ₹{totalEarnings.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2. Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="Pending Requests"
            value={pendingOrders.length}
            color="bg-yellow-400 text-black"
            icon={<Clock size={20} />}
            subtitle="Requires quotation & time slot"
          />
          <MetricCard
            title="Ongoing Repairs"
            value={ongoingOrders.length}
            color="bg-blue-600 text-white"
            icon={<Wrench size={20} />}
            subtitle="Active items on workbench"
          />
          <MetricCard
            title="Completed Jobs"
            value={completedOrders.length}
            color="bg-green-600 text-white"
            icon={<CheckCircle2 size={20} />}
            subtitle="Delivered & payment confirmed"
          />
        </div>

        {/* 3. Services & Base Rates Editor */}
        <section className="mb-10 p-6 rounded-md bg-white border-2 border-zinc-900 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
            <div>
              <h2 className="text-lg font-black text-zinc-950">
                My Repair Services & Base Quotes
              </h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                Click price to update base estimate for customers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(services).map((catKey) => {
              const meta = CATEGORIES.find((c) => c.key === catKey);
              const isEditing = editingCategory === catKey;

              return (
                <div
                  key={catKey}
                  className="p-3 rounded-md bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{meta?.emoji || '🔧'}</span>
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      {catKey}
                    </span>
                  </div>

                  <div>
                    {isEditing ? (
                      <input
                        autoFocus
                        type="number"
                        value={services[catKey]}
                        onChange={(e) =>
                          setServices({
                            ...services,
                            [catKey]: Number(e.target.value),
                          })
                        }
                        onBlur={() => setEditingCategory(null)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && setEditingCategory(null)
                        }
                        className="w-20 px-2 py-1 text-xs font-bold rounded-sm border-2 border-blue-600 text-right bg-white"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingCategory(catKey)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-zinc-300 hover:border-black text-xs font-black text-zinc-900 cursor-pointer"
                      >
                        <span>₹{services[catKey]}</span>
                        <Pencil size={11} className="text-zinc-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Order Management Hub */}
        <section className="p-6 rounded-md bg-white border-2 border-zinc-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-zinc-950">
                Repair Orders & Job Triage
              </h2>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                Review pending submissions, accept quotes, and complete servicing
              </p>
            </div>

            {/* Tab switchers with Spring Animation */}
            <div className="flex p-1 rounded-md bg-zinc-100 border border-zinc-200">
              {[
                { key: 'pending', label: 'Pending', count: pendingOrders.length },
                { key: 'ongoing', label: 'In-Progress', count: ongoingOrders.length },
                { key: 'completed', label: 'Completed', count: completedOrders.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    activeTab === tab.key
                      ? 'text-white'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="shopOrderTab"
                      className={`absolute inset-0 rounded-sm ${
                        tab.key === 'pending'
                          ? 'bg-yellow-500'
                          : tab.key === 'ongoing'
                          ? 'bg-blue-600'
                          : 'bg-green-600'
                      }`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">
                    {tab.label} ({tab.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Orders List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {displayedOrders.length === 0 ? (
                <div className="text-center py-12 p-6 rounded-md bg-zinc-50 border border-zinc-200">
                  <p className="text-sm font-bold text-zinc-600">
                    No {activeTab} repair requests right now.
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    New consumer requests will show up here automatically.
                  </p>
                </div>
              ) : (
                displayedOrders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onAccept={() => {
                      setAcceptTarget(order);
                      setAcceptForm({
                        pickup: '2026-08-23T10:00',
                        complete: '2026-08-24T18:00',
                        price: order.price,
                        notes: 'Parts in stock. Diagnostic will begin on receipt.',
                      });
                    }}
                    onReject={() => rejectOrder(order.id)}
                    onComplete={() => completeOrder(order.id)}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* Accept & Quote Dialog Modal */}
      <Modal
        open={!!acceptTarget}
        onClose={() => setAcceptTarget(null)}
        title="Accept Repair & Issue Quote"
        maxWidth="max-w-lg"
      >
        {acceptTarget && (
          <form onSubmit={handleAcceptConfirm} className="flex flex-col gap-4">
            <div className="p-3.5 rounded-md bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">
                  Customer: {acceptTarget.customerName}
                </span>
                <SolidBadge variant="blue">{acceptTarget.item}</SolidBadge>
              </div>
              <p className="text-xs text-zinc-600 mt-1">
                <strong>Issue:</strong> {acceptTarget.issue}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                <strong>Address:</strong> {acceptTarget.address} • <strong>Phone:</strong> {acceptTarget.mobile}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Exact Quoted Repair Price (₹) *
              </label>
              <input
                type="number"
                required
                value={acceptForm.price}
                onChange={(e) => setAcceptForm({ ...acceptForm, price: e.target.value })}
                placeholder="e.g. 650"
                className="w-full px-3 py-2 text-sm font-bold rounded-md bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Drop-off / Submission Window *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={acceptForm.pickup}
                  onChange={(e) => setAcceptForm({ ...acceptForm, pickup: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-medium rounded-md bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Estimated Ready by *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={acceptForm.complete}
                  onChange={(e) => setAcceptForm({ ...acceptForm, complete: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-medium rounded-md bg-white border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Technician Notes / Instructions
              </label>
              <textarea
                rows={2}
                value={acceptForm.notes}
                onChange={(e) => setAcceptForm({ ...acceptForm, notes: e.target.value })}
                placeholder="Bring original charger / backup your data before drop-off…"
                className="w-full px-3 py-2 text-xs rounded-md bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            <div className="p-3 rounded-md bg-green-50 border border-green-200 text-xs text-green-900">
              <p className="font-bold">Customer Notification Preview:</p>
              <p className="text-[11px] text-green-800 mt-0.5">
                The user's interface will update immediately with this quote, scheduled drop-off slot, and collection deadline.
              </p>
            </div>

            <SolidButton type="submit" variant="blue" className="w-full py-2.5 font-bold">
              Confirm & Start Repair Job
            </SolidButton>
          </form>
        )}
      </Modal>
    </div>
  );
}

function MetricCard({ title, value, color, icon, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="p-5 rounded-md bg-white border-2 border-zinc-900 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`size-8 rounded-sm flex items-center justify-center font-bold ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-black text-zinc-950 block">{value}</span>
        <span className="text-xs text-zinc-500 font-medium mt-1 block">{subtitle}</span>
      </div>
    </motion.div>
  );
}

function OrderRow({ order, onAccept, onReject, onComplete }) {
  const catMeta = CATEGORIES.find((c) => c.key === order.item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="p-5 rounded-md bg-zinc-50 border border-zinc-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="size-12 rounded-sm bg-blue-600 text-white flex items-center justify-center text-2xl shrink-0 font-bold">
          {catMeta?.emoji || '🔧'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-black text-zinc-950">{order.customerName}</span>
            <SolidBadge variant={order.status}>{order.status}</SolidBadge>
            <span className="text-xs font-bold text-blue-600">₹{order.price}</span>
          </div>
          <p className="text-xs text-zinc-700 font-medium mt-1">
            <strong>{order.item}:</strong> {order.issue}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-zinc-500">
            <span>📍 {order.address}</span>
            <span>•</span>
            <span>📞 {order.mobile}</span>
            <span>•</span>
            <span>🕒 {order.requestedAt}</span>
          </div>
          {order.pickupAt && (
            <p className="text-xs text-zinc-700 font-semibold mt-1">
              📅 Drop-off: {order.pickupAt} {order.completionAt && `• Ready: ${order.completionAt}`}
            </p>
          )}
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-200">
        {order.status === 'pending' && (
          <>
            <SolidButton
              variant="blue"
              size="sm"
              onClick={onAccept}
              className="text-xs font-bold"
            >
              <Check size={14} />
              <span>Accept & Quote</span>
            </SolidButton>
            <SolidButton
              variant="danger"
              size="sm"
              onClick={onReject}
              className="text-xs font-bold"
            >
              <X size={14} />
              <span>Reject</span>
            </SolidButton>
          </>
        )}

        {order.status === 'ongoing' && (
          <SolidButton
            variant="green"
            size="sm"
            onClick={onComplete}
            className="text-xs font-bold"
          >
            <CheckCircle2 size={15} />
            <span>Mark as Completed & Settle</span>
          </SolidButton>
        )}

        {order.status === 'completed' && (
          <div className="text-right">
            <span className="text-xs font-bold text-green-700 block">
              ✓ Settled directly with customer
            </span>
            {order.rating && (
              <div className="mt-1 flex items-center justify-end gap-1 text-xs">
                <Stars rating={order.rating.score} size={12} />
                <span className="text-zinc-600 text-[11px]">"{order.rating.feedback}"</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
