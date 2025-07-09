'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CafeteriaContextType {
  selectedCafe: string;
  setSelectedCafe: (value: string) => void;
}

const CafeteriaContext = createContext<CafeteriaContextType | undefined>(undefined);

export function CafeteriaProvider({ children }: { children: ReactNode }) {
  const [selectedCafe, setSelectedCafe] = useState('');

  return (
    <CafeteriaContext.Provider value={{ selectedCafe, setSelectedCafe }}>
      {children}
    </CafeteriaContext.Provider>
  );
}

export function useCafeteria() {
  const context = useContext(CafeteriaContext);
  if (!context) throw new Error('useCafeteria must be used within CafeteriaProvider');
  return context;
}

