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
}

interface DemoState {
  user: DemoUser;
  selectedPayment: DemoPaymentMethod;
  activeTrip: DemoTrip | null;
  recentActions: string[];
}

interface DemoStateContextValue extends DemoState {
  setUser: (user: Partial<DemoUser>) => void;
  setSelectedPayment: (method: DemoPaymentMethod) => void;
  setActiveTrip: (trip: DemoTrip | null) => void;
  addRecentAction: (action: string) => void;
  resetDemoState: () => void;
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
      }}
    >
      {children}
    </DemoStateContext.Provider>
  );
};
