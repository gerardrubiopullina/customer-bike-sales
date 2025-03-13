'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { Customer } from '@/app/types';
import { useFilters } from './FilterContext';

interface CustomerContextType {
    customers: Customer[];
    loading: boolean;
    error: Error | null;
    filteredCustomers: Customer[];
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { filters } = useFilters();

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const matchesCluster = filters.selectedClusters.includes(customer.clustering);
            const matchesGender = filters.selectedGender === "All" || customer.Gender === filters.selectedGender;
            const matchesCountry = filters.selectedCountry === "all" || customer.CountryRegionName === filters.selectedCountry;
            const matchesBikeBuyer = filters.selectedBikeBuyer === "all" || 
                (filters.selectedBikeBuyer === "buyers" && customer.BikeBuyer === 1) ||
                (filters.selectedBikeBuyer === "non-buyers" && customer.BikeBuyer === 0);
            
            return matchesCluster && matchesGender && matchesCountry && matchesBikeBuyer;
        });
    }, [customers, filters]);

    useEffect(() => {
        const fetchAllCustomers = async () => {
            try {
                const response = await fetch('/clustering_results.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                const data: Customer[] = await response.json();
                setCustomers(data);
            } catch (err) {
                console.error("Error fetching customer data:", err);
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        };
        fetchAllCustomers();
    }, []);

    return (
        <CustomerContext.Provider value={{ 
            customers, 
            loading, 
            error,
            filteredCustomers 
        }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomers() {
    const context = useContext(CustomerContext);
    if (context === undefined) {
        throw new Error('useCustomers must be used within a CustomerProvider');
    }
    return context;
}