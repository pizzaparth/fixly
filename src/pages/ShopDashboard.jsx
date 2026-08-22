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
  User,
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    updateServices,
  } = useStore();

  const activeShop = shops.find(s => s.id === session?.id);

  const [activeTab, setActiveTab] = useState('pending');
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [acceptForm, setAcceptForm] = useState({
    pickup: '',
    complete: '',
    price: '',
    notes: '',
  });

  const [services, setServices] = useState(() => {
    if (!activeShop) return {};
    
    const backendDict = activeShop.servicePrices || {};
    const fallbackDict = Object.fromEntries(
      (activeShop.categories || []).map((c) => [c, activeShop.estCost || 500])
    );
    
    return { ...fallbackDict, ...backendDict };
  });

  const saveServicesToBackend = (newServices) => {
    setServices(newServices);
    if (activeShop?.id) {
      updateServices(activeShop.id, newServices);
    }
  };

  if (!activeShop) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        <Store className="size-16 text-zinc-300 mb-4" />
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Technician Profile Not Found</h2>
        <p className="text-zinc-600 max-w-md mx-auto">
          We could not locate your shop listings. This usually happens if the database is empty or your profile was not set up completely.
        </p>
      </div>
    );
  }

  const [editingCategory, setEditingCategory] = useState(null);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const ongoingOrders = orders.filter((o) => o.status === 'ongoing');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const totalEarnings = completedOrders.reduce(
    (sum, o) => sum + (Number(o.price) || 0),
    0
  );

  const displayedOrders = orders.filter((o) => o.status === activeTab);

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
        <Card className="p-6 rounded-3xl bg-zinc-50 border-2 border-zinc-900 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-purple-600 flex items-center justify-center text-4xl text-white font-black shrink-0 shadow-sm">
                {activeShop.emoji || '🔧'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-950">{activeShop.name}</h1>
                  <Badge className="bg-purple-600 text-white font-bold rounded-full">
                    Technician Console
                  </Badge>
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

            <div className="p-4 rounded-2xl bg-zinc-950 text-white flex items-center gap-4 border border-black shrink-0">
              <div className="size-11 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
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
          </div>
        </Card>

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

        <Card className="mb-10 p-6 rounded-3xl bg-white border-2 border-zinc-900 shadow-sm">
          <CardHeader className="p-0 border-b border-zinc-200 pb-3 mb-4">
            <CardTitle className="text-lg font-black text-zinc-950">
              My Repair Services & Base Quotes
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
              Click price to update base estimate for customers
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(services).map((catKey) => {
              const meta = CATEGORIES.find((c) => c.key === catKey);
              const isEditing = editingCategory === catKey;

              return (
                <div
                  key={catKey}
                  className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl">{meta?.emoji || '🔧'}</span>
                    <span className="text-xs font-bold text-zinc-900 truncate">
                      {catKey}
                    </span>
                  </div>

                  <div>
                    {isEditing ? (
                      <Input
                        autoFocus
                        type="number"
                        value={services[catKey]}
                        onChange={(e) =>
                          setServices({
                            ...services,
                            [catKey]: Number(e.target.value),
                          })
                        }
                        onBlur={() => {
                          setEditingCategory(null);
                          saveServicesToBackend(services);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingCategory(null);
                            saveServicesToBackend(services);
                          }
                        }}
                        className="w-20 h-8 text-xs font-bold rounded-full border-2 border-blue-600 text-right bg-white"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingCategory(catKey)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-300 hover:border-black text-xs font-black text-zinc-900 cursor-pointer"
                      >
                        <span>₹{services[catKey]}</span>
                        <Pencil size={11} className="text-zinc-400" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {CATEGORIES.filter(c => !services[c.key]).length > 0 && (
              <select
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 border-dashed text-xs font-bold text-zinc-600 cursor-pointer hover:bg-zinc-100 outline-none appearance-none text-center"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    saveServicesToBackend({ ...services, [e.target.value]: 500 });
                  }
                }}
              >
                <option value="" disabled>+ Add Service</option>
                {CATEGORIES.filter(c => !services[c.key]).map(c => (
                  <option key={c.key} value={c.key}>
                    {c.emoji} {c.key}
                  </option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>

        <Card className="p-6 rounded-3xl bg-white border-2 border-zinc-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4 mb-6">
            <div>
              <CardTitle className="text-xl font-black text-zinc-950">
                Repair Orders & Job Triage
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                Review pending submissions, accept quotes, and complete servicing
              </CardDescription>
            </div>

            <div className="flex p-1.5 rounded-full bg-zinc-100 border border-zinc-200">
              {[
                { key: 'pending', label: 'Pending', count: pendingOrders.length },
                { key: 'ongoing', label: 'In-Progress', count: ongoingOrders.length },
                { key: 'completed', label: 'Completed', count: completedOrders.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    activeTab === tab.key
                      ? 'text-white'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="shopOrderTab"
                      className={`absolute inset-0 rounded-full ${
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
                <div className="text-center py-12 p-6 rounded-2xl bg-zinc-50 border border-zinc-200">
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
        </Card>
      </div>

      <Modal
        open={!!acceptTarget}
        onClose={() => setAcceptTarget(null)}
        title="Accept Repair & Issue Quote"
        maxWidth="max-w-lg"
      >
        {acceptTarget && (
          <form onSubmit={handleAcceptConfirm} className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">
                  Customer: {acceptTarget.customerName}
                </span>
                <Badge className="bg-blue-600 text-white font-bold rounded-full">{acceptTarget.item}</Badge>
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
              <Input
                type="number"
                required
                value={acceptForm.price}
                onChange={(e) => setAcceptForm({ ...acceptForm, price: e.target.value })}
                placeholder="e.g. 650"
                className="font-bold rounded-full px-4 bg-white border-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Drop-off / Submission Window *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={acceptForm.pickup}
                  onChange={(e) => setAcceptForm({ ...acceptForm, pickup: e.target.value })}
                  className="text-xs rounded-full px-4 bg-white border-zinc-300"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                  Estimated Ready by *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={acceptForm.complete}
                  onChange={(e) => setAcceptForm({ ...acceptForm, complete: e.target.value })}
                  className="text-xs rounded-full px-4 bg-white border-zinc-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                Technician Notes / Instructions
              </label>
              <Textarea
                rows={2}
                value={acceptForm.notes}
                onChange={(e) => setAcceptForm({ ...acceptForm, notes: e.target.value })}
                placeholder="Bring original charger / backup your data before drop-off…"
                className="text-xs rounded-2xl px-4 py-2 bg-white border-zinc-300 resize-none"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-900">
              <p className="font-bold">Customer Notification Preview:</p>
              <p className="text-[11px] text-green-800 mt-0.5">
                The user's interface will update immediately with this quote, scheduled drop-off slot, and collection deadline.
              </p>
            </div>

            <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full">
              Confirm & Start Repair Job
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

function MetricCard({ title, value, color, icon, subtitle }) {
  return (
    <Card className="p-6 rounded-3xl bg-white border-2 border-zinc-900 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {title}
        </CardDescription>
        <div className={`size-9 rounded-full flex items-center justify-center font-bold ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <CardTitle className="text-3xl font-black text-zinc-950 block">{value}</CardTitle>
        <CardDescription className="text-xs text-zinc-500 font-medium mt-1 block">{subtitle}</CardDescription>
      </div>
    </Card>
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
    >
      <Card className="p-5 rounded-2xl bg-zinc-50 border border-zinc-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-none">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="size-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl shrink-0 font-bold">
            {catMeta?.emoji || '🔧'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-black text-zinc-950">{order.customerName}</span>
              <Badge
                className={`rounded-full ${
                  order.status === 'pending'
                    ? 'bg-yellow-400 text-black font-bold'
                    : order.status === 'ongoing'
                    ? 'bg-blue-600 text-white font-bold'
                    : order.status === 'completed'
                    ? 'bg-green-600 text-white font-bold'
                    : 'bg-rose-600 text-white font-bold'
                }`}
              >
                {order.status}
              </Badge>
              <span className="text-sm font-bold text-blue-600">₹{order.price}</span>
            </div>
            <p className="text-sm text-zinc-700 font-medium mt-1">
              <strong>{order.item}:</strong> {order.issue}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
              <span>📍 {order.address}</span>
              <span>•</span>
              <span>📞 {order.mobile}</span>
              <span>•</span>
              <span>🕒 {order.requestedAt}</span>
            </div>
            {order.pickupAt && (
              <p className="text-sm text-zinc-700 font-semibold mt-1">
                📅 Drop-off: {order.pickupAt} {order.completionAt && `• Ready: ${order.completionAt}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-200">
          {order.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={onAccept}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full px-4"
              >
                <Check size={16} />
                <span>Accept & Quote</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onReject}
                className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-full px-4"
              >
                <X size={16} />
                <span>Reject</span>
              </Button>
            </>
          )}

          {order.status === 'ongoing' && (
            <Button
              size="sm"
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-full px-4"
            >
              <CheckCircle2 size={16} />
              <span>Mark as Completed</span>
            </Button>
          )}

          {order.status === 'completed' && (
            <div className="text-right">
              <span className="text-sm font-bold text-green-700 block">
                ✓ Settled directly with customer
              </span>
              {order.rating && (
                <div className="mt-1 flex items-center justify-end gap-1 text-sm">
                  <Stars rating={order.rating.score} size={14} />
                  <span className="text-zinc-600 text-xs font-medium">"{order.rating.feedback}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
