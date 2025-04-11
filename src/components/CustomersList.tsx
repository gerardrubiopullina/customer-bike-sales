'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Customer } from '@/app/types';
import { useCustomers } from '@/context/CustomerContext';
import { getClusterColorClass } from '@/functions/utils';
import { PedalBike } from '@mui/icons-material';
import ButtonNewCustomer from './ButtonNewCustomer';


const CUSTOMERS_PER_PAGE = 20

export default function CustomersList() {

  const { filteredCustomers } = useCustomers();

  const [displayedCustomers, setDisplayedCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filteredCustomers.length > 0) {
      setLoading(true);
      const newCustomers = filteredCustomers.slice(0, page * CUSTOMERS_PER_PAGE);
      setDisplayedCustomers(newCustomers);
      setLoading(false);
    }
  }, [filteredCustomers, page]);

  const handleScroll = useCallback(() => {
    const table = tableRef.current;
    if (table) {
      const bottom = table.scrollHeight - table.scrollTop - table.clientHeight < 1;
      if (bottom && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading]);

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener('scroll', handleScroll);
      return () => {
        if (table) table.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, loading]);

  return (
    <div className="h-full card bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="overflow-auto flex-1" onScroll={handleScroll} ref={tableRef}>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider bg-slate-50">
                <div className="flex items-center gap-2">
                  <span>Customer</span>
                  <ButtonNewCustomer />
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider bg-slate-50">
                Location
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider bg-slate-50">
                Age
              </th>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider bg-slate-50">
                Group
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedCustomers.map((customer) => (
              <tr key={customer.CustomerID} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{`${customer.FirstName} ${customer.LastName}`}</span>
                  {customer.BikeBuyer == 1 && (
                    <span className="ml-2 text-slate-500"><PedalBike /></span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.CountryRegionName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.Age}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getClusterColorClass(customer.clustering)}`}></div>
                    <span>Cluster {customer.clustering}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center py-2 bg-slate-50 border-t">
          <span className="text-sm text-slate-500">Loading more customers...</span>
        </div>
      )}
    </div>
  );
}