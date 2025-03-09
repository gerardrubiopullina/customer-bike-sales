'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Customer } from '@/app/types';

interface CustomerContextType {
    customers: Customer[];
    loading: boolean;
    error: Error | null;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
        <CustomerContext.Provider value={{ customers, loading, error }}>
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