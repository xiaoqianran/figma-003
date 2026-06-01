/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface DemoUser {
  name: string;
  phone: string;
  avatar: string;
}

export interface DemoPaymentMethod {
  id: string;
  type: 'visa' | 'gody' | 'alipay' | 'wechat';
  label: string;
  last4?: string;
}

export interface DemoTrip {
  id: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  from: string;
  to: string;
  driver?: string;
  vehicle?: string;
  eta?: string;
  price?: number;
  paid?: boolean;
}

interface DemoState {
  user: DemoUser;
  selectedPayment: DemoPaymentMethod;
  activeTrip: DemoTrip | null;
  bookedTrips: DemoTrip[];
  recentActions: string[];
}

interface DemoStateContextValue extends DemoState {
  setUser: (user: Partial<DemoUser>) => void;
  setSelectedPayment: (method: DemoPaymentMethod) => void;
  setActiveTrip: (trip: DemoTrip | null) => void;
  addRecentAction: (action: string) => void;
  resetDemoState: () => void;
  // Multi-trip booking lifecycle (core missing functionality completed)
  bookTrip: (trip: Omit<DemoTrip, 'id'> & { id?: string }) => DemoTrip;
  updateTripStatus: (id: string, status: DemoTrip['status'], extra?: Partial<DemoTrip>) => void;
  cancelTrip: (id: string) => void;
  completeTrip: (id: string) => void;
  clearBookedTrips: () => void;
}

const defaultUser: DemoUser = {
  name: 'Alex Chen',
  phone: '+44 7700 900123',
  avatar: '👨‍💼',
};

const defaultPayment: DemoPaymentMethod = {
  id: 'visa-4242',
  type: 'visa',
  label: 'Visa •••• 4242',
  last4: '4242',
};

const DemoStateContext = createContext<DemoStateContextValue | null>(null);

export const useDemoState = () => {
  const ctx = useContext(DemoStateContext);
  if (!ctx) throw new Error('useDemoState must be used within DemoStateProvider');
  return ctx;
};

const initialState: DemoState = {
  user: defaultUser,
  selectedPayment: defaultPayment,
  activeTrip: null,
  bookedTrips: [],
  recentActions: [],
};

export const DemoStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoState>(initialState);

  const setUser = useCallback((partial: Partial<DemoUser>) => {
    setState(s => ({ ...s, user: { ...s.user, ...partial } }));
  }, []);

  const setSelectedPayment = useCallback((method: DemoPaymentMethod) => {
    setState(s => ({ ...s, selectedPayment: method }));
  }, []);

  const setActiveTrip = useCallback((trip: DemoTrip | null) => {
    setState(s => ({ ...s, activeTrip: trip }));
  }, []);

  const addRecentAction = useCallback((action: string) => {
    setState(s => ({
      ...s,
      recentActions: [action, ...s.recentActions].slice(0, 8),
    }));
  }, []);

  // --- NEW: Multi-trip lifecycle (completes core missing booking persistence) ---
  const bookTrip = useCallback((tripInput: Omit<DemoTrip, 'id'> & { id?: string }): DemoTrip => {
    const newTrip: DemoTrip = {
      id: tripInput.id || `trip-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      status: tripInput.status || 'upcoming',
      from: tripInput.from,
      to: tripInput.to,
      driver: tripInput.driver,
      vehicle: tripInput.vehicle,
      eta: tripInput.eta,
      price: tripInput.price,
      paid: tripInput.paid ?? false,
    };
    setState(s => {
      const exists = s.bookedTrips.some(t => t.id === newTrip.id);
      const nextTrips = exists ? s.bookedTrips : [...s.bookedTrips, newTrip];
      return {
        ...s,
        bookedTrips: nextTrips,
        activeTrip: newTrip, // focus the newly booked as current
      };
    });
    return newTrip;
  }, []);

  const updateTripStatus = useCallback((id: string, status: DemoTrip['status'], extra?: Partial<DemoTrip>) => {
    setState(s => {
      const nextTrips = s.bookedTrips.map(t =>
        t.id === id ? { ...t, status, ...extra } : t
      );
      const nextActive = s.activeTrip?.id === id
        ? { ...s.activeTrip, status, ...extra }
        : s.activeTrip;
      return { ...s, bookedTrips: nextTrips, activeTrip: nextActive };
    });
  }, []);

  const cancelTrip = useCallback((id: string) => {
    updateTripStatus(id, 'completed'); // treat cancelled as terminal for lists; could add 'cancelled' status but keep simple
    setState(s => {
      const target = s.bookedTrips.find(t => t.id === id);
      if (target && s.activeTrip?.id === id) {
        // keep it visible in active briefly or clear? For demo, leave as completed in active for detail pages
      }
      return s; // mutations already done in update
    });
  }, [updateTripStatus]);

  const completeTrip = useCallback((id: string) => {
    updateTripStatus(id, 'completed', { eta: 'Arrived', paid: true });
  }, [updateTripStatus]);

  const clearBookedTrips = useCallback(() => {
    setState(s => ({ ...s, bookedTrips: [], activeTrip: null }));
  }, []);

  const resetDemoState = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <DemoStateContext.Provider
      value={{
        ...state,
        setUser,
        setSelectedPayment,
        setActiveTrip,
        addRecentAction,
        resetDemoState,
        // New multi-trip APIs
        bookTrip,
        updateTripStatus,
        cancelTrip,
        completeTrip,
        clearBookedTrips,
      }}
    >
      {children}
    </DemoStateContext.Provider>
  );
};
