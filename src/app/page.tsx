import CustomersList from "@/components/CustomersList";
import MetricCard from "@/components/MetricCard";
import { Groups2, PedalBike, Troubleshoot } from "@mui/icons-material";


export default function Home() {

  const metrics = {
    totalCustomers: 18355,
    bikeBuyers: 10127,
    conversionRate: 55.17,
    topCluster: 3,
    topClusterConversion: 82.4
  };
  
  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4 overflow-y-auto">
        <CustomersList/>
      </div>
      <div className="col-span-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MetricCard
            title="Total Customers"
            value={metrics.totalCustomers.toLocaleString()}
            description="Unique customers in database"
            icon={<Groups2/>}
          />
          <MetricCard
            title="Bike Buyers"
            value={`${metrics.conversionRate}%`}
            description={`${metrics.bikeBuyers.toLocaleString()} customers purchased bikes`}
            icon={<PedalBike/>}
          />
          <MetricCard
            title="Top Performing Cluster"
            value={`Cluster ${metrics.topCluster}`}
            description={`${metrics.topClusterConversion}% conversion rate`}
            icon={<Troubleshoot/>}
          />
        </div>
      </div>
    </div>
  );
}

//TODO: use page.tsx as a layout with {children}
//TODO: handle data fetching in a hook/generic function