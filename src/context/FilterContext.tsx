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

export const CLUSTERS = ["1", "2", "3"];
export const CLUSTERS_COLORS_CLASS = ["cluster-1-bg", "cluster-2-bg", "cluster-3-bg"];
export const GENDERS = ["All", "M", "F"];

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>({
        selectedClusters: CLUSTERS,
        selectedGender: GENDERS[0],
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