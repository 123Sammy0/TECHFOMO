'use client';

import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}

export const FilterContext = createContext<FilterContextType>({
  activeFilter: 'ALL',
  setActiveFilter: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  return (
    <FilterContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}
