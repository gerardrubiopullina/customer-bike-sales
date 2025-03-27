'use client'

import { useCustomers } from "@/context/CustomerContext";
import { useFilters } from "@/context/FilterContext";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip} from 'recharts';

// Colores consistentes con los demás componentes
const COLORS = ["#008080", "#003366", "#ff7f0e"];

// Función para acortar nombres largos
const shortenMetricName = (name: string): string => {
  const words = name.split(' ');
  if (words.length === 1) return name.slice(0, 6) + '.';
  return words.map(word => word[0] + '.').join(' ');
};

// Función para normalizar valores entre 0 y 1
const normalizeValue = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

// Función para calcular el promedio
const calculateAverage = (values: number[]) => {
  return values.reduce((acc, val) => acc + val, 0) / values.length;
};

interface MetricData {
  values: number[];
  min: number;
  max: number;
}

interface ClusterMetrics {
  NumberCarsOwned: MetricData;
  NumberChildrenAtHome: MetricData;
  TotalChildren: MetricData;
  YearlyIncome: MetricData;
  AvgMonthSpend: MetricData;
  Age: MetricData;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    color: string;
    payload: {
      metric: string;
      metricKey: string;
      [key: string]: any;
    };
  }>;
}

interface MetricDefinition {
  id: keyof ClusterMetrics;
  name: string;
  radarName: string;
}

export default function ClusterRadarChart() {
  const { filteredCustomers } = useCustomers();
  const { filters } = useFilters();

  // Preparar datos por cluster
  const clusterData = filters.selectedClusters.reduce<Record<string, ClusterMetrics>>((acc, clusterId) => {
    const clusterCustomers = filteredCustomers.filter(customer => customer.clustering === clusterId);
    
    acc[clusterId] = {
      NumberCarsOwned: {
        values: clusterCustomers.map(c => c.NumberCarsOwned),
        min: Math.min(...clusterCustomers.map(c => c.NumberCarsOwned)),
        max: Math.max(...clusterCustomers.map(c => c.NumberCarsOwned))
      },
      NumberChildrenAtHome: {
        values: clusterCustomers.map(c => c.NumberChildrenAtHome),
        min: Math.min(...clusterCustomers.map(c => c.NumberChildrenAtHome)),
        max: Math.max(...clusterCustomers.map(c => c.NumberChildrenAtHome))
      },
      TotalChildren: {
        values: clusterCustomers.map(c => c.TotalChildren),
        min: Math.min(...clusterCustomers.map(c => c.TotalChildren)),
        max: Math.max(...clusterCustomers.map(c => c.TotalChildren))
      },
      YearlyIncome: {
        values: clusterCustomers.map(c => c.YearlyIncome),
        min: Math.min(...clusterCustomers.map(c => c.YearlyIncome)),
        max: Math.max(...clusterCustomers.map(c => c.YearlyIncome))
      },
      AvgMonthSpend: {
        values: clusterCustomers.map(c => c.AvgMonthSpend),
        min: Math.min(...clusterCustomers.map(c => c.AvgMonthSpend)),
        max: Math.max(...clusterCustomers.map(c => c.AvgMonthSpend))
      },
      Age: {
        values: clusterCustomers.map(c => c.Age),
        min: Math.min(...clusterCustomers.map(c => c.Age)),
        max: Math.max(...clusterCustomers.map(c => c.Age))
      }
    };
    return acc;
  }, {});

  // Encontrar valores mínimos y máximos globales para normalización
  const globalMetrics = Object.keys(clusterData[filters.selectedClusters[0]]).reduce<Record<keyof ClusterMetrics, { min: number; max: number }>>((acc, key) => {
    const metricKey = key as keyof ClusterMetrics;
    acc[metricKey] = {
      min: Math.min(...filters.selectedClusters.map(clusterId => clusterData[clusterId][metricKey].min)),
      max: Math.max(...filters.selectedClusters.map(clusterId => clusterData[clusterId][metricKey].max))
    };
    return acc;
  }, {} as Record<keyof ClusterMetrics, { min: number; max: number }>);

  // Preparar datos normalizados para el radar chart
  const metrics: MetricDefinition[] = [
    { id: "NumberCarsOwned", name: "Cars Owned", radarName: "Cars" },
    { id: "NumberChildrenAtHome", name: "Children at Home", radarName: "H. Kids" },
    { id: "TotalChildren", name: "Total Children", radarName: "T. Kids" },
    { id: "YearlyIncome", name: "Yearly Income", radarName: "Income" },
    { id: "AvgMonthSpend", name: "Monthly Spend", radarName: "Spend" },
    { id: "Age", name: "Age", radarName: "Age" }
  ];

  interface DataPoint {
    metric: string;
    metricKey: keyof ClusterMetrics;
    [key: string]: string | number;
  }

  const data = metrics.map(metric => {
    const dataPoint: DataPoint = {
      metric: metric.name,
      metricKey: metric.id
    };

    filters.selectedClusters.forEach(clusterId => {
      const clusterMetrics = clusterData[clusterId];
      const avgValue = calculateAverage(clusterMetrics[metric.id].values);
      dataPoint[`cluster${clusterId}`] = normalizeValue(
        avgValue,
        globalMetrics[metric.id].min,
        globalMetrics[metric.id].max
      );
      dataPoint[`cluster${clusterId}Raw`] = avgValue;
    });

    return dataPoint;
  });

  // Tooltip personalizado para mostrar valores reales
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const metricKey = payload[0].payload.metricKey as keyof ClusterMetrics;
      
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-slate-200">
          <p className="font-medium text-slate-700">{payload[0].payload.metric}</p>
          {payload.map((entry) => {
            const clusterId = entry.dataKey.replace('cluster', '');
            const rawValue = entry.payload[`${entry.dataKey}Raw`] as number;
            const metrics = clusterData[clusterId][metricKey];
            
            return (
              <div key={entry.dataKey} className="text-sm">
                <p className="text-slate-600" style={{ color: entry.color }}>
                  Cluster {clusterId}: {rawValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-slate-500">
                  Range: {metrics.min.toLocaleString()} - {metrics.max.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="40%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="metric"
            tickFormatter={(value) => {
              const metric = metrics.find(m => m.name === value);
              return metric ? metric.radarName : value;
            }}
            className="uppercase tracking-wider font-semibold mb-4 text-slate-600 text-xs"
            tick={{
              fill: '#475569',
              fontSize: 14,
              dy: 20,
              dx: 0,
            }}
            tickLine={false}
            axisLine={false}
          />
          {filters.selectedClusters.map((clusterId) => (
            <Radar
              key={clusterId}
              name={`Cluster ${clusterId}`}
              dataKey={`cluster${clusterId}`}
              stroke={COLORS[Number(clusterId) - 1]}
              fill={COLORS[Number(clusterId) - 1]}
              fillOpacity={0.3}
            />
          ))}
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 