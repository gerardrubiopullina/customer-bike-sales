'use client'

import { Groups2, PedalBike, Troubleshoot } from "@mui/icons-material";
import MetricCard from "./MetricCard";
import { useCustomers } from "@/context/CustomerContext";
import { calculateMetrics } from "@/functions/utils";


export default function MetricsRow() {

    const {filteredCustomers} = useCustomers();

    const metrics = calculateMetrics(filteredCustomers);

    return(
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
                description={`${metrics.topClusterConversion.toFixed(2)}% conversion rate`}
                icon={<Troubleshoot/>}
            />
        </div>
    )
}