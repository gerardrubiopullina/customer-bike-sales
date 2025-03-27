import ClusterRadarChart from "./ClusterRadarChart";
import ClusterBikePurchaseChart from "./ClusterBikePurchaseChart";
import CustomersSummary from "./CustomersSummary";

export default function ClusterAnalysis() {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
            <h2 className="uppercase tracking-wider font-semibold mb-4 text-slate-600 text-md">
                Perfil de Clientes por Cluster
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
                <div className="flex-1 min-h-0 overflow-hidden">
                    <CustomersSummary />
                </div>
                <div className="flex-1 min-h-0 overflow-visible flex justify-end">
                    <div className="w-full max-w-[600px] h-full overflow-visible">
                        <ClusterRadarChart />
                    </div>
                </div>
            </div>
        </div>
    )
}
