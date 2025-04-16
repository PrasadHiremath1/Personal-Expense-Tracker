'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#D76EF5', '#EA5C2B'];

const filters = ['Today', 'Last Week', 'Last Month', 'This Year', 'All Time'];

export default function BreakdownPage() {
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ [key: string]: number }>({});
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All Time');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/transactions');
        setAllTransactions(res.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = filterTransactions(allTransactions, selectedFilter);
    const categories: { [key: string]: number } = {};

    filtered.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    setCategoryBreakdown(categories);
  }, [allTransactions, selectedFilter]);

  const chartData = useMemo(() => {
    return Object.entries(categoryBreakdown).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [categoryBreakdown]);

  function filterTransactions(transactions: any[], filter: string) {
    const now = new Date();
    return transactions.filter((t) => {
      const date = new Date(t.date);

      switch (filter) {
        case 'Today':
          return date.toDateString() === now.toDateString();
        case 'Last Week':
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return date >= oneWeekAgo;
        case 'Last Month':
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return date >= oneMonthAgo;
        case 'This Year':
          return date.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
  <h1 className="text-2xl font-bold mb-6 text-center">Category Breakdown</h1>

  {/* Filter Dropdown */}
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-center sm:text-left">
    <label className="font-medium mb-2 sm:mb-0">Filter by:</label>
    <select
      value={selectedFilter}
      onChange={(e) => setSelectedFilter(e.target.value)}
      className="border border-gray-300 px-3 py-1 rounded-md shadow-sm w-48 mx-auto sm:mx-0"
    >
      {filters.map((f) => (
        <option key={f} value={f}>
          {f}
        </option>
      ))}
    </select>
  </div>

  {/* Main Layout */}
  <div className="flex flex-col md:flex-row gap-10 items-start">
    {/* Category List */}
    {/* Category List */}
    <div className="flex-1 space-y-4">
      {Object.keys(categoryBreakdown).length > 0 ? (
        Object.entries(categoryBreakdown).map(([category, amount]) => (
          <div
            key={category}
            className="border border-gray-300 rounded-md p-4 shadow-sm max-w-xs mx-auto w-full md:mx-0"
          >
            <h2 className="text-base font-semibold text-center md:text-left">
              {category}: ₹{amount}
            </h2>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic text-center">No category data for this filter.</p>
      )}
    </div>


    {/* Pie Chart */}
    {chartData.length > 0 && (
      <div className="flex-1 flex justify-center md:justify-start">
        <PieChart width={300} height={300} className="mx-auto">
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    )}
  </div>


      {/* Bar Chart Section */}
      {chartData.length > 0 && (
        <div className="mt-10 p-4 border border-gray-300 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">Category Comparison - Bar Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}
