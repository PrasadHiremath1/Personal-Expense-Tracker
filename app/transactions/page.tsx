'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ [key: string]: number }>({});
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [originalTransaction, setOriginalTransaction] = useState<Transaction | null>(null);
  const predefinedCategories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Others'];


  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/transactions');
        const txns = res.data.transactions;
        setTransactions(txns);

        const breakdown: { [key: string]: number } = {};
        txns.forEach((t: Transaction) => {
          breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
        });
        setCategoryBreakdown(breakdown);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchData();
  }, []);

  const updateCategoryBreakdown = (transactions: Transaction[]) => {
    const breakdown: { [key: string]: number } = {};
    transactions.forEach((t) => {
      breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
    });
    setCategoryBreakdown(breakdown);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions((prevTransactions) => {
        const updatedTransactions = prevTransactions.filter((t) => t._id !== id);
        updateCategoryBreakdown(updatedTransactions);
        return updatedTransactions;
      });
    } catch (error) {
      alert('Failed to delete the transaction. Please try again.');
      console.error('Error deleting transaction:', error);
    }
  };

  // Handle Edit - set the transaction to be edited
  const handleEdit = (transaction: Transaction) => {
    setOriginalTransaction(transaction);
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    if (originalTransaction) {
      setEditingTransaction(originalTransaction); // Restore original values
    }
    setEditingTransaction(null);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (editingTransaction) {
      if (
        !editingTransaction.description.trim() ||
        isNaN(editingTransaction.amount) ||
        editingTransaction.amount <= 0 ||
        !editingTransaction.category.trim()
      ) {
        alert('Please provide valid inputs for all fields.');
        return;
      }
      try {
        const updatedTransaction = await axios.put(`/api/transactions/${editingTransaction._id}`, editingTransaction);
        setTransactions((prevTransactions) => {
          const updatedTransactions = prevTransactions.map((t) =>
            t._id === updatedTransaction.data._id ? updatedTransaction.data : t
          );
          updateCategoryBreakdown(updatedTransactions);
          return updatedTransactions;
        });
        setEditingTransaction(null); // Close the form
      } catch (error) {
        alert('Failed to save the transaction. Please try again.');
        console.error('Error updating transaction:', error);
      }
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <Card className="p-4">
        <CardTitle className="text-lg font-bold">All Transactions</CardTitle>
        {transactions.map((t) => (
          <CardTitle key={t._id} className="text-sm flex justify-between items-center">
            {editingTransaction && editingTransaction._id === t._id ? (
              // Inline edit form
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                  className="border p-1"
                />
                <input
                    type="number"
                    value={
                      editingTransaction.amount !== undefined && !isNaN(editingTransaction.amount)
                        ? editingTransaction.amount
                        : ''
                    }
                    onChange={(e) =>
                      setEditingTransaction({
                        ...editingTransaction,
                        amount: e.target.value === '' ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="border p-1"
                  />

                  <select
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                    className="border p-1"
                  >
                    <option value="">Select Category</option>
                    {predefinedCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                <Button
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white"
                  disabled={
                    !editingTransaction.description.trim() ||
                    isNaN(editingTransaction.amount) ||
                    editingTransaction.amount <= 0 ||
                    !editingTransaction.category.trim()
                  }
                >
                  Save
                </Button>
                <Button onClick={handleCancelEdit} className="bg-gray-600 text-white">
                  Cancel
                </Button>
              </div>
            ) : (
              // Display transaction details
              <div className="flex justify-between w-full">
                <span>
                  {t.description} - ₹{t.amount} | {t.category}
                </span>
                <div className="space-x-2">
                  <Button onClick={() => handleEdit(t)} className="bg-blue-600 text-white">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(t._id)} className="bg-red-600 text-white">
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </CardTitle>
        ))}
      </Card>
    </main>
  );
}
