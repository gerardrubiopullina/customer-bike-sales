'use client'

import { useCustomers } from "@/context/CustomerContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Text } from "recharts";
import { Selector } from "./Selector";
import { useState } from "react";

interface ChartData {
  name: string;
  [clusterKey: string]: string | number;
}

interface DataCounts {
  [clusterId: string]: number;
}

type GroupByKey = "Education" | "Occupation";
const GROUP_BY_OPTIONS: GroupByKey[] = ["Education", "Occupation"];

const COLORS = ["#008080", "#003366", "#ff7f0e"];

export default function CustomersDistributionChart() {
  const { customers } = useCustomers();
  const [groupBy, setGroupBy] = useState<GroupByKey>("Education");

  const clusterIds = Array.from(new Set(customers.map((c) => c.clustering))).sort();

  const prepareChartData = (): ChartData[] => {
    if (!customers || customers.length === 0) return [];

    const groupedData: Record<string, DataCounts> = {};

    customers.forEach((customer) => {
      const category = (customer[groupBy] ?? "Unknown") as string;
      const cluster = customer.clustering;
      if (!groupedData[category]) {
        groupedData[category] = {};
      }
      groupedData[category][cluster] = (groupedData[category][cluster] || 0) + 1;
    });

    const chartData: ChartData[] = Object.entries(groupedData).map(
      ([category, clusterCounts]) => {
        const entry: ChartData = { name: category };
        clusterIds.forEach((clusterId) => {
          entry[clusterId] = clusterCounts[clusterId] || 0;
        });
        return entry;
      }
    );

    return chartData;
  };

  const data = prepareChartData();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="uppercase tracking-wider font-semibold mb-4 text-slate-600">
          Customers distribution by
        </h2>
        <Selector
          options={GROUP_BY_OPTIONS}
          value={groupBy}
          onChange={(value) => setGroupBy(value as GroupByKey)}
        />
      </div>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ right: 20 }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 12 }}
              tickCount={8}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 13 }}
              axisLine={true}
              tickLine={false}
              width={90}
            />
            {clusterIds.map((clusterId, index) => (
              <Bar
                key={clusterId}
                dataKey={clusterId}
                name={`Cluster ${clusterId}`}
                fill={COLORS[index % COLORS.length]}
                stackId="clusters"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
