import IncomePerAgeChart from "@/components/IncomePerAgeChart";
import CustomersBarChart from "@/components/CustomersDistributionChart";
import CustomersList from "@/components/CustomersList";
import MetricsRow from "@/components/MetricsRow";
import BikeBuyerHeatmap from "@/components/BikeBuyerHeatmap";


export default function Home() {
  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4 overflow-y-auto">
        <CustomersList />
      </div>
      <div className="col-span-8">
        <MetricsRow/>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <CustomersBarChart />
          </div>
          <div>
            <IncomePerAgeChart />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <BikeBuyerHeatmap />
          </div>
          <div className="bg-white col-span-3 rounded-lg shadow-md p-4 h-full">
            Analisis de los clusters.
            porcentaje de bike buyers en cada cluster y clientes totales. Explicacion y generales
            Explicar para filtrar por solo un cluster para ver mas en detalle y mostrar el radar de las distintas propeidades e info mas relevante?
            Ultim chat x ideas
          </div>
        </div>
      </div>
    </div>
  );
}
