'use client'

import { useEffect, useState } from "react";
import axios from "axios";

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
};

type Props = {
  refresh: boolean;
};

export default function TransactionList({ refresh }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data.transactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  // fetch on mount + when refresh value changes
  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <div className="space-y-2">
      {transactions.length > 0 ? (
        transactions.map((t) => (
          <div key={t._id} className="border p-2 rounded shadow-sm bg-white">
            <p className="text-black">
              <strong className="text-black">₹{t.amount}</strong> - {t.description}
            </p>
            <p className="text-sm text-gray-900">
              {new Date(t.date).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No transactions yet.</p>
      )}
    </div>
  );
}
