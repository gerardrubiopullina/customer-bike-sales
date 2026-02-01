import IncomePerAgeChart from "@/components/IncomePerAgeChart";
import CustomersBarChart from "@/components/CustomersDistributionChart";
import CustomersList from "@/components/CustomersList";
import MetricsRow from "@/components/MetricsRow";
import BikeBuyerHeatmap from "@/components/BikeBuyerHeatmap";
import ClusterAnalysis from "@/components/ClusterAnalysis";


export default function Home() {
  return (
    <div className="dashboard-grid h-full grid grid-cols-1 auto-rows-min gap-4 p-4 lg:grid-cols-12 lg:grid-rows-[auto_repeat(4,minmax(0,1fr))]">
      <div className="h-[45vh] sm:h-[55vh] lg:h-full min-h-0 lg:col-start-1 lg:col-end-5 lg:row-start-1 lg:row-end-6">
        <CustomersList />
      </div>
      <div className="min-h-0 lg:col-start-5 lg:col-end-13 lg:row-start-1 lg:row-end-2">
        <MetricsRow />
      </div>
      <div className="min-h-0 lg:col-start-5 lg:col-end-9 lg:row-start-2 lg:row-end-4">
        <CustomersBarChart />
      </div>
      <div className="min-h-0 lg:col-start-9 lg:col-end-13 lg:row-start-2 lg:row-end-4">
        <IncomePerAgeChart />
      </div>
      <div className="min-h-0 lg:col-start-5 lg:col-end-8 lg:row-start-4 lg:row-end-6">
        <BikeBuyerHeatmap />
      </div>
      <div className="min-h-0 lg:col-start-8 lg:col-end-13 lg:row-start-4 lg:row-end-6">
        <ClusterAnalysis />
      </div>
    </div>
  );
}
