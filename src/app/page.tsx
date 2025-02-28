import CustomersList from "@/components/CustomersList";

export default function Home() {
  
  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4">
      <div className="col-span-4">
        <CustomersList/>
      </div>
    </div>
  );
}