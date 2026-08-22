import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyShops, dummyOrders } from '../data/mockData';

const StoreContext = createContext(null);

const SESSION_STORAGE_KEY = 'fixly_session_v1';
const SHOPS_STORAGE_KEY = 'fixly_shops_v1';
const ORDERS_STORAGE_KEY = 'fixly_orders_v1';

export function StoreProvider({ children }) {
  // 1. Session state
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { role: 'customer', name: 'Priya Reddy', email: 'priya@gmail.com' };
    } catch {
      return { role: 'customer', name: 'Priya Reddy', email: 'priya@gmail.com' };
    }
  });

  // 2. Shops state
  const [shops, setShops] = useState(() => {
    try {
      const stored = localStorage.getItem(SHOPS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : dummyShops;
    } catch {
      return dummyShops;
    }
  });

  // 3. Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : dummyOrders;
    } catch {
      return dummyOrders;
    }
  });

  // 4. Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeShopModalId, setActiveShopModalId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem(SHOPS_STORAGE_KEY, JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Auth actions
  const login = (sessionData) => {
    setSession(sessionData);
  };

  const logout = () => {
    setSession(null);
  };

  // Shop actions
  const addShop = (newShopData) => {
    const newShop = {
      id: `s_${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      distanceKm: (Math.random() * 3 + 0.5).toFixed(1),
      feedback: [],
      emoji: '🔧',
      color: 'bg-blue-600 text-white',
      ...newShopData,
    };
    setShops((prev) => [newShop, ...prev]);
    return newShop;
  };

  const updateShopServices = (shopId, servicesRecord) => {
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const categories = Object.keys(servicesRecord).filter((k) => servicesRecord[k] > 0);
          return { ...s, categories };
        }
        return s;
      })
    );
  };

  const addFeedback = (shopId, { author, rating, text }) => {
    const feedbackItem = {
      id: `f_${Date.now()}`,
      author: author || 'Customer',
      rating: Number(rating) || 5,
      text,
      date: 'Just now',
    };

    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const newFeedback = [feedbackItem, ...(s.feedback || [])];
          const avgRating =
            newFeedback.reduce((acc, f) => acc + f.rating, 0) / newFeedback.length;
          return {
            ...s,
            feedback: newFeedback,
            reviewCount: newFeedback.length,
            rating: parseFloat(avgRating.toFixed(1)),
          };
        }
        return s;
      })
    );
  };

  const addRating = (shopId, ratingScore) => {
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const newCount = (s.reviewCount || 0) + 1;
          const currentTotal = (s.rating || 5) * (s.reviewCount || 0);
          const newAvg = (currentTotal + ratingScore) / newCount;
          return {
            ...s,
            rating: parseFloat(newAvg.toFixed(1)),
            reviewCount: newCount,
          };
        }
        return s;
      })
    );
  };

  // Order actions
  const createOrder = ({
    customerName,
    customerEmail,
    mobile,
    address,
    item,
    issue,
    shopId,
    price,
    pickupAt,
  }) => {
    const targetShop = shops.find((s) => s.id === shopId);
    const newOrder = {
      id: `o_${Date.now()}`,
      customerName: customerName || session?.name || 'Guest User',
      customerEmail: customerEmail || session?.email || 'customer@example.com',
      mobile,
      address,
      shopId,
      shopName: targetShop?.name || 'Local Repair Expert',
      item,
      issue: issue || 'Repair diagnostic needed',
      requestedAt: 'Just now',
      pickupAt: pickupAt || '',
      price: price || targetShop?.estCost || 500,
      status: 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const acceptOrder = (orderId, { pickupAt, completionAt, price }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'ongoing',
            pickupAt: pickupAt || o.pickupAt,
            completionAt: completionAt || 'Tomorrow, 06:00 PM',
            price: price || o.price,
          };
        }
        return o;
      })
    );
  };

  const rejectOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'rejected' } : o))
    );
  };

  const completeOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
    );
  };

  const rateOrder = (orderId, { score, feedback }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            rating: {
              score,
              feedback,
              ratedAt: new Date().toISOString().split('T')[0],
            },
          };
        }
        return o;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && targetOrder.shopId) {
      addFeedback(targetOrder.shopId, {
        author: targetOrder.customerName,
        rating: score,
        text: feedback,
      });
    }
  };

  const value = {
    session,
    login,
    logout,
    shops,
    orders,
    addShop,
    updateShopServices,
    addFeedback,
    addRating,
    createOrder,
    acceptOrder,
    rejectOrder,
    completeOrder,
    rateOrder,
    authModalOpen,
    setAuthModalOpen,
    activeShopModalId,
    setActiveShopModalId,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
