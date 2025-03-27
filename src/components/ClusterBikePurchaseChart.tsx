'use client'

import { useCustomers } from "@/context/CustomerContext";
import { useFilters } from "@/context/FilterContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface ClusterData {
  cluster: string;
  totalCustomers: number;
  bikePurchasers: number;
  nonBikePurchasers: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ClusterData;
    value: number;
    name: string;
  }>;
}

export default function ClusterBikePurchaseChart() {
  const { filteredCustomers } = useCustomers();
  const { filters } = useFilters();

  const prepareData = (): ClusterData[] => {
    return filters.selectedClusters.map(clusterId => {
      const clusterCustomers = filteredCustomers.filter(customer => customer.clustering === clusterId);
      const bikePurchasers = clusterCustomers.filter(customer => customer.BikeBuyer === 1).length;
      const nonBikePurchasers = clusterCustomers.length - bikePurchasers;
      
      return {
        cluster: `Cluster ${clusterId}`,
        totalCustomers: clusterCustomers.length,
        bikePurchasers: bikePurchasers,
        nonBikePurchasers: nonBikePurchasers
      };
    });
  };

  const data = prepareData();

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const clusterData = payload[0].payload;
      const purchaseRate = (clusterData.bikePurchasers / clusterData.totalCustomers) * 100;
      
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-slate-200">
          <p className="font-medium text-slate-700">{clusterData.cluster}</p>
          <p className="text-sm text-slate-600">
            Total Clientes: {clusterData.totalCustomers.toLocaleString()}
          </p>
          <p className="text-sm text-slate-600">
            Compradores de Bicis: {clusterData.bikePurchasers.toLocaleString()}
          </p>
          <p className="text-sm text-slate-600">
            Tasa de Compra: {purchaseRate.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cluster" />
          <YAxis 
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="nonBikePurchasers" 
            name="No Compradores" 
            stackId="a"
            fill="#94a3b8"
          />
          <Bar 
            dataKey="bikePurchasers" 
            name="Compradores de Bicis" 
            stackId="a"
            fill="#008080"
            label={{ 
              position: 'top',
              formatter: (value: number) => `${value.toLocaleString()}`
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 