import CustomersBarChart from "@/components/CustomersDistributionChart";
import CustomersList from "@/components/CustomersList";
// import IncomeSpentCorrelationChart from "@/components/IncomeSpentCorrelationChart";
import MetricsRow from "@/components/MetricsRow";


export default function Home() {

  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4 overflow-y-auto">
        <CustomersList/>
      </div>
      <div className="col-span-8">
        <MetricsRow/>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <CustomersBarChart/>
          </div>
          <div>
            {/* <IncomeSpentCorrelationChart/> */}
          </div>
        </div>
      </div>
    </div>
  );
}