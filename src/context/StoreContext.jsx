import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext(null);
const SESSION_STORAGE_KEY = 'fixly_session_v1';

export function StoreProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeShopModalId, setActiveShopModalId] = useState(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  const fetchShops = useCallback(async () => {
    try {
      const techRes = await fetch('/api/technicians');
      const listRes = await fetch('/api/listings');
      const technicians = await techRes.json();
      const listings = await listRes.json();

      const mappedShops = technicians.map(t => {
        const listing = listings.find(l => l.technician?._id === t._id || l.technician === t._id);
        return {
          id: t._id,
          name: listing?.title || t.name,
          owner: t.name,
          mobile: t.phone,
          address: t.location?.address,
          rating: t.rating || 5,
          reviewCount: t.ratingCount || 0,
          estCost: listing?.priceRange?.min || 500,
          categories: t.specialties || [],
          emoji: '🔧',
          color: 'bg-blue-600 text-white',
          distanceKm: (Math.random() * 3 + 0.5).toFixed(1),
          feedback: [],
          listingId: listing?._id
        };
      });
      setShops(mappedShops);
    } catch (err) {
      console.error('Error fetching shops:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!session || !session.id) return;
    try {
      const isTech = session.role === 'shop';
      const url = isTech ? `/api/requests?technicianId=${session.id}` : `/api/requests?userId=${session.id}`;
      const res = await fetch(url);
      const data = await res.json();
      
      const mappedOrders = data.map(o => {
        let status = o.status;
        if (status === 'in_progress') status = 'ongoing';
        return {
          id: o._id,
          customerName: o.user?.name || 'Customer',
          customerEmail: o.user?.email,
          mobile: o.user?.phone,
          address: o.user?.location?.address || 'N/A',
          shopId: o.technician?._id,
          shopName: o.technician?.name || 'Local Repair Expert',
          item: o.productCategory,
          issue: o.issueDescription,
          requestedAt: new Date(o.createdAt).toLocaleDateString(),
          pickupAt: o.quote?.submissionTimeSlot || '',
          completionAt: o.quote?.returnTimeSlot || '',
          price: o.quote?.exactPrice || 500,
          status,
          rating: o.rating
        };
      });
      setOrders(mappedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, [session]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const login = async (sessionData) => {
    try {
      const role = sessionData.role === 'shop' ? 'technician' : 'consumer';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sessionData.email,
          password: sessionData.password,
          role
        })
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response (Please restart the backend server)');
      }
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }
      if (data.success) {
        const userToSet = {
          ...data.user,
          role: data.user.role === 'technician' ? 'shop' : 'customer'
        };
        setSession(userToSet);
        return userToSet;
      }
      return null;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const registerUser = async (sessionData) => {
    try {
      const role = sessionData.role === 'shop' ? 'technician' : 'consumer';
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sessionData.email,
          name: sessionData.name,
          password: sessionData.password,
          role,
          phone: sessionData.phone
        })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response (Please restart the backend server)');
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }
      if (data.success) {
        const userToSet = {
          ...data.user,
          role: data.user.role === 'technician' ? 'shop' : 'customer'
        };
        setSession(userToSet);
        return userToSet;
      }
      return null;
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const logout = () => {
    setSession(null);
    setOrders([]);
  };

  const addShop = async (newShopData) => {
    try {
      await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technicianId: newShopData.technicianId,
          title: newShopData.name,
          category: newShopData.categories[0] || 'General',
          productTypes: newShopData.categories,
          priceRange: { min: newShopData.estCost, max: newShopData.estCost + 500 },
          description: `Listing for ${newShopData.name}`,
        })
      });
      fetchShops();
      return { id: newShopData.technicianId };
    } catch (err) {
      console.error('Error creating listing:', err);
    }
  };

  const updateShopServices = (shopId, servicesRecord) => {
    // For now, no-op or just refresh. Backend doesn't have an endpoint for this easily exposed yet.
    fetchShops();
  };

  const addFeedback = () => {};
  const addRating = () => {};

  const createOrder = async ({ customerName, customerEmail, mobile, address, item, issue, shopId, price }) => {
    try {
      const targetShop = shops.find((s) => s.id === shopId);
      const listingId = targetShop?.listingId;
      
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.id,
          technicianId: shopId,
          listingId,
          productCategory: item,
          productName: item,
          issueDescription: issue
        })
      });
      fetchOrders();
      return true;
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const acceptOrder = async (orderId, { pickupAt, completionAt, price }) => {
    try {
      await fetch(`/api/requests/${orderId}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exactPrice: price,
          submissionTimeSlot: pickupAt,
          returnTimeSlot: completionAt
        })
      });
      
      // Then mark as in_progress immediately
      await fetch(`/api/requests/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' })
      });
      
      fetchOrders();
    } catch (err) {
      console.error('Error accepting order:', err);
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      await fetch(`/api/requests/${orderId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Not able to service right now.' })
      });
      fetchOrders();
    } catch (err) {
      console.error('Error rejecting order:', err);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      await fetch(`/api/requests/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      fetchOrders();
    } catch (err) {
      console.error('Error completing order:', err);
    }
  };

  const rateOrder = async (orderId, { score, feedback }) => {
    try {
      await fetch(`/api/requests/${orderId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, feedback })
      });
      fetchOrders();
      fetchShops();
    } catch (err) {
      console.error('Error rating order:', err);
    }
  };

  const value = {
    session,
    login,
    registerUser,
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
