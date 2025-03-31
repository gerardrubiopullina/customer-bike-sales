'use client'

import ClusterRadarChart from "./ClusterRadarChart";
import ClusterDetailView from "./ClusterDetailView";
import CustomersSummary from "./CustomersSummary";
import { useFilters } from "@/context/FilterContext";

export default function ClusterAnalysis() {

    const {filters} = useFilters()

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
            <h2 className="uppercase tracking-wider font-semibold mb-4 text-slate-600 text-md">
                Customer analysis per cluster
            </h2>
            
            <div className="flex flex-col md:flex-row gap-3 flex-1 min-h-0">
                <div className="flex-[1.6] min-h-0 overflow-hidden">
                    {
                        filters.selectedClusters.length > 1 
                        ? <CustomersSummary />
                        : <ClusterDetailView />
                    }
                </div>
                <div className="flex-1 min-h-0 overflow-visible flex justify-end">
                    <div className="w-full max-w-[500px] h-full overflow-visible">
                        <ClusterRadarChart />
                    </div>
                </div>
            </div>
        </div>
    )
}
