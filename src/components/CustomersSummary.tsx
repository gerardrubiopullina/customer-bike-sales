'use client'

import { useCustomers } from "@/context/CustomerContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Colores consistentes con los demás componentes
const COLORS = ["#008080", "#003366", "#ff7f0e"];

export default function CustomersSummary() {
  const { filteredCustomers } = useCustomers();

  // Agrupar datos por cluster
  const clusterData = filteredCustomers.reduce((acc, customer) => {
    const clusterId = customer.clustering;
    
    if (!acc[clusterId]) {
      acc[clusterId] = {
        id: clusterId,
        totalCustomers: 0,
        bikeBuyers: 0,
        color: COLORS[Number(clusterId) - 1],
        name: `Cluster ${clusterId}`
      };
    }
    
    acc[clusterId].totalCustomers += 1;
    if (customer.BikeBuyer) {
      acc[clusterId].bikeBuyers += 1;
    }
    
    return acc;
  }, {} as Record<string, { id: string; name: string; totalCustomers: number; bikeBuyers: number; color: string }>);

  // Convertir a array y calcular porcentajes
  const clusters = Object.values(clusterData).map(cluster => ({
    ...cluster,
    nonBuyers: cluster.totalCustomers - cluster.bikeBuyers,
    buyerPercentage: ((cluster.bikeBuyers / cluster.totalCustomers) * 100).toFixed(1)
  }));

  // Datos para el gráfico de pie único
  const pieData = clusters.map(cluster => ({
    name: `Cluster ${cluster.id}`,
    value: cluster.totalCustomers,
    color: cluster.color
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
      <h2 className="uppercase tracking-wider font-semibold mb-4 text-slate-600 text-sm">
        Customer Segments Overview
      </h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col justify-center">
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} customers`, name]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          {clusters.map(cluster => (
            <div 
              key={cluster.id} 
              className="bg-slate-50 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: cluster.color }}
                  ></div>
                  <h3 className="font-semibold text-slate-700">
                    Cluster {cluster.id}
                  </h3>
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {cluster.totalCustomers.toLocaleString()} customers
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Conversion Rate</span>
                  <span className="font-medium text-teal-600">
                    {cluster.buyerPercentage}%
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-slate-500">
                        {cluster.bikeBuyers.toLocaleString()} buyers
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-slate-400">
                        {cluster.nonBuyers.toLocaleString()} non-buyers
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200">
                    <div
                      style={{
                        width: `${cluster.buyerPercentage}%`,
                        backgroundColor: cluster.color
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}