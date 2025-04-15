import ClientDashboard from "@/components/ClientDashboard";

export default function Home() {
  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Visualizer</h1>
      <ClientDashboard />
    </main>
  );
}

