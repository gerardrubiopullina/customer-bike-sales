import { Customer, MetricsData } from "@/app/types";


interface ClusterData {
  [key: string]: {
    total: number;
    buyers: number;
  };
}

export const getClusterColorClass = (cluster: string) => {
  switch(cluster) {
    case "1": return "cluster-1-bg";
    case "2": return "cluster-2-bg";
    case "3": return "cluster-3-bg";
    default: return "bg-gray-400";
  }
};

export function calculateMetrics(customers: Customer[]): MetricsData {

  if (!customers || customers.length === 0) {
    return {
      totalCustomers: 0,
      bikeBuyers: 0,
      conversionRate: "0.00",
      topCluster: 'N/A',
      topClusterConversion: 0
    };
  }

  const totalCustomers = customers.length;
  const bikeBuyers = customers.filter(customer => customer.BikeBuyer == 1).length;
  
  const conversionRate = totalCustomers > 0 
    ? ((bikeBuyers / totalCustomers) * 100).toFixed(2) 
    : "0.00";

  const clusterData: ClusterData = {};
  customers.forEach(customer => {
    const cluster = customer.clustering;
    
    if (!clusterData[cluster]) {
      clusterData[cluster] = {
        total: 0,
        buyers: 0
      };
    }
    
    clusterData[cluster].total += 1;
    if (customer.BikeBuyer) {
      clusterData[cluster].buyers += 1;
    }
  });

  let topCluster = 'N/A';
  let topClusterConversion = 0;

  Object.entries(clusterData).forEach(([cluster, data]) => {
    const { total, buyers } = data as { total: number, buyers: number };
    const clusterConversion = total > 0 ? (buyers / total) * 100 : 0;
    
    if (clusterConversion > topClusterConversion) {
      topClusterConversion = clusterConversion;
      topCluster = cluster;
    }
  });

  return {
    totalCustomers,
    bikeBuyers,
    conversionRate,
    topCluster,
    topClusterConversion
  }
}