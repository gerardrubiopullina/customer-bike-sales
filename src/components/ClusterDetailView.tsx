'use client'

import { useCustomers } from "@/context/CustomerContext";
import { useFilters } from "@/context/FilterContext";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { getClusterColorClass } from "@/functions/utils";

interface ClusterData {
    name: string;
    total: number;
    buyers: number;
    nonBuyers: number;
}

interface TopCustomer {
    name: string;
    tel: string;
    avgMonthSpend: number;
}

export default function ClusterDetailView() {
    
    const { filteredCustomers } = useCustomers();
    const { filters } = useFilters();

    const clusterId = filters.selectedClusters[0];
    const clusterCustomers = filteredCustomers.filter(customer => customer.clustering === clusterId);
    
    const totalCustomers = clusterCustomers.length;
    const bikeBuyers = clusterCustomers.filter(customer => customer.BikeBuyer === 1).length;
    const nonBuyers = totalCustomers - bikeBuyers;
    const buyerPercentage = ((bikeBuyers / totalCustomers) * 100).toFixed(1);

    const chartData: ClusterData[] = [{
        name: `Cluster ${clusterId}`,
        total: totalCustomers,
        buyers: bikeBuyers,
        nonBuyers: nonBuyers
    }];

    const topCustomers: TopCustomer[] = clusterCustomers
        .sort((a, b) => b.AvgMonthSpend - a.AvgMonthSpend)
        .slice(0, 3)
        .map(customer => ({
        name: `${customer.FirstName} ${customer.LastName}`,
        tel: customer.PhoneNumber || 'N/A',
        avgMonthSpend: customer.AvgMonthSpend
    }));

    return (
        <div className="h-full bg-white rounded-lg shadow-sm flex flex-col">
            <div className="h-1/5">
                <ResponsiveContainer width="100%" height="200%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ right: 40 }}
                        barSize={30}
                        maxBarSize={30}
                    >
                        <XAxis
                            type="number"
                            tick={false}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, totalCustomers]}
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={false}
                            axisLine={false}
                            tickLine={false}
                            width={0}
                        />
                        <Bar
                            dataKey="buyers"
                            name="Compradores de Bicis"
                            fill={`var(--${getClusterColorClass(clusterId).replace('-bg', '')})`}
                            stackId="a"
                            label={{
                                position: 'insideStart',
                                content: ({ value }: { value?: number | string }) => {
                                const numValue = typeof value === 'number' ? value : 0;
                                return `${numValue.toLocaleString()} (${buyerPercentage}%)`;
                                },
                                fill: 'white',
                                fontSize: 12,
                                fontWeight: 500
                            }}
                        />
                        <Bar
                            dataKey="nonBuyers"
                            name="No Compradores"
                            fill="#e5e7eb"
                            stackId="a"
                        />
                        <Bar
                            dataKey="total"
                            name="Total"
                            fill="transparent"
                            label={{
                                position: 'right',
                                content: () => totalCustomers.toLocaleString(),
                                fill: '#64748b',
                                fontSize: 12,
                                fontWeight: 500
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">
                                Top Customers
                            </th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">
                                Monthly
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {topCustomers.map((customer, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-slate-700">{customer.name}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-slate-700">{customer.tel}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-slate-700">${customer.avgMonthSpend.toLocaleString()}</span>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 