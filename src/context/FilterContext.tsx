'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
    selectedClusters: string[];
    selectedGender: string;
    selectedCountry: string;
    selectedBikeBuyer: string;
}

interface FilterContextType {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>({
        selectedClusters: ["1", "2", "3"],
        selectedGender: "All",
        selectedCountry: "all",
        selectedBikeBuyer: "all"
    });

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useFilters() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
} 