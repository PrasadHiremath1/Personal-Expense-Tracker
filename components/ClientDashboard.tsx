'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardTitle } from './ui/card';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

export default function Dashboard() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any>({});
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(false); // trigger reload for TransactionList

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/transactions');
      const transactions = res.data.transactions;

      // Calculate total expenses
      const total = transactions.reduce((acc: number, t: any) => acc + t.amount, 0);
      setTotalExpenses(total);

      // Category breakdown
      const categories: { [key: string]: number } = {};
      transactions.forEach((t: any) => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
      setCategoryBreakdown(categories);

      // Get the most recent transactions
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]); // re-fetch when refresh changes

  return (
    <div className="space-y-6">
      {/* Form to Add Transaction */}
      <Card className="p-4">
        <CardTitle className="mb-2 text-lg font-bold">Add Transaction</CardTitle>
        <TransactionForm onSuccess={() => setRefresh((r) => !r)} />
      </Card>

      {/* Summary */}
      <Card className="p-4">
        <CardTitle className="text-lg font-bold">Total Expenses: ₹{totalExpenses}</CardTitle>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-4">
        <CardTitle className="text-lg font-bold">Category Breakdown:</CardTitle>
        {Object.keys(categoryBreakdown).map((category) => (
          <CardTitle key={category} className="text-sm text-muted-foreground">
            {category}: ₹{categoryBreakdown[category]}
          </CardTitle>
        ))}
      </Card>

      {/* Recent Transactions */}
      <Card className="p-4">
        <CardTitle className="text-lg font-bold">Recent Transactions:</CardTitle>
        {recentTransactions.map((t) => (
          <CardTitle key={t._id} className="text-sm">
            {t.description} - ₹{t.amount}
          </CardTitle>
        ))}
      </Card>

      {/* All Transactions */}
      <Card className="p-4">
        <CardTitle className="mb-2 text-lg font-bold">All Transactions</CardTitle>
        <TransactionList refresh={refresh} />
      </Card>
    </div>
  );
}
