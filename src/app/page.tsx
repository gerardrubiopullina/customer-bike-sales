import CustomersList from "@/components/CustomersList";
import MetricsRow from "@/components/MetricsRow";


export default function Home() {
  
  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4 overflow-y-auto">
        <CustomersList/>
      </div>
      <div className="col-span-8">
        <MetricsRow/>
      </div>
    </div>
  );
}

//TODO: handle data fetching in a hook/generic function