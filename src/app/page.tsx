import IncomePerAgeChart from "@/components/IncomePerAgeChart";
import CustomersBarChart from "@/components/CustomersDistributionChart";
import CustomersList from "@/components/CustomersList";
import MetricsRow from "@/components/MetricsRow";
import BikeBuyerHeatmap from "@/components/BikeBuyerHeatmap";
import ClusterRadarChart from "@/components/ClusterRadarChart";


export default function Home() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-5 gap-4 p-4">
      <div className="col-start-1 col-end-5 row-start-1 row-end-6">
        <CustomersList />
      </div>
      <div className="col-start-5 col-end-13 row-start-1 row-end-2">
        <MetricsRow/>
      </div>
      <div className="col-start-5 col-end-9 row-start-2 row-end-4">
        <CustomersBarChart />
      </div>
      <div className="col-start-9 col-end-13 row-start-2 row-end-4">
        <IncomePerAgeChart />
      </div>
      <div className="col-start-5 col-end-8 row-start-4 row-end-6">
        <BikeBuyerHeatmap />
      </div>
      <div className="col-start-8 col-end-13 row-start-4 row-end-6">
        <ClusterRadarChart />
      </div>
    </div>
  );
}
