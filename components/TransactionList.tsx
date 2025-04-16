
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
// import { Card, Text } from 'shadcn/ui';
import { Card, CardTitle } from './ui/card';

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
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
      console.error('Failed to fetch transactions:', error);
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
          <Card key={t._id} className="p-4">
            <CardTitle>
              <strong>₹{t.amount}</strong> - {t.description}
            </CardTitle>
            <CardTitle className="text-sm text-gray-600">
              {new Date(t.date).toLocaleDateString()} | <em>{t.category}</em>
            </CardTitle>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 italic">No transactions yet.</p>
      )}
    </div>
  );
}
