"use client";

import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import { useState } from "react";

export default function ClientDashboard() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <TransactionForm onSuccess={handleRefresh} />
      <hr className="my-6" />
      <TransactionList refresh={refresh} />
    </div>
  );
}
