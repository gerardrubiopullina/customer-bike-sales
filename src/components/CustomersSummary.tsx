'use client'

import { useCustomers } from "@/context/CustomerContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

  const totalCustomers = clusters.reduce((acc, cluster) => acc + cluster.totalCustomers, 0);

  return (
    <div className="h-full flex pr-6">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius="90%"
              innerRadius="55%"
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-semibold text-slate-700"
            >
              {totalCustomers.toLocaleString()}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-50 ml-2 flex flex-col min-h-0">
        <div className="space-y-2 flex-1 overflow-auto">
          {clusters.map(cluster => (
            <div 
              key={cluster.id} 
              className="bg-slate-50 rounded-lg p-2.5 transition-all duration-200 hover:shadow-sm cursor-pointer w-auto"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: cluster.color }}
                  ></div>
                  <h3 className="font-medium text-slate-700 text-sm">
                    Cluster {cluster.id}
                  </h3>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {cluster.totalCustomers.toLocaleString()} users
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span>{cluster.bikeBuyers.toLocaleString()} buyers</span>
                <span className="font-medium">{cluster.buyerPercentage}%</span>
              </div>

              <div>
                <div className="overflow-hidden h-1.5 text-xs flex rounded-full bg-slate-200">
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
          ))}
        </div>
      </div>
    </div>
  );
}