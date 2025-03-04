'use client';

import { getClusterColorClass } from '@/functions/utils';

interface Customer {
  id: number;
  name: string;
  country: string;
  age: number;
  cluster: number;
  bikeBuyer: boolean;
}

export default function CustomersList() {
  
  // Default users ui testing
  const customers: Customer[] = [
    { id: 1, name: "User Test1", country: "USA", age: 42, cluster: 1, bikeBuyer: true },
    { id: 2, name: "User Test2", country: "CAN", age: 35, cluster: 3, bikeBuyer: true },
    { id: 3, name: "User Test3", country: "USA", age: 29, cluster: 2, bikeBuyer: false },
    { id: 4, name: "User Test4", country: "GBR", age: 38, cluster: 1, bikeBuyer: true },
    { id: 5, name: "User Test5", country: "MEX", age: 45, cluster: 3, bikeBuyer: true },
    { id: 6, name: "User Test6", country: "FRA", age: 31, cluster: 2, bikeBuyer: false },
    { id: 7, name: "User Test7", country: "JPN", age: 40, cluster: 1, bikeBuyer: true },
    { id: 8, name: "User Test8", country: "AUS", age: 36, cluster: 3, bikeBuyer: true },
    { id: 9, name: "User Test9", country: "ESP", age: 33, cluster: 2, bikeBuyer: false },
    { id: 10, name: "User Test10", country: "DEU", age: 39, cluster: 1, bikeBuyer: true },
    { id: 11, name: "User Test11", country: "AUS", age: 36, cluster: 3, bikeBuyer: true },
    { id: 12, name: "User Test12", country: "ESP", age: 33, cluster: 2, bikeBuyer: false },
    { id: 13, name: "User Test13", country: "DEU", age: 39, cluster: 1, bikeBuyer: true },
  ];

  return (
    <div className="h-full card overflow-hidden flex flex-col">
      <div className="p-4 bg-slate-50 border-b">
        <h2 className="text-base font-semibold text-slate-700">Customers List</h2>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Group</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{customer.name}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getClusterColorClass(customer.cluster)}`}></div>
                    <span>Cluster {customer.cluster}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}