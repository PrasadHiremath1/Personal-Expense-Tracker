'use client'

import { useState } from "react";
import axios from "axios";

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/transactions', { amount: Number(amount), description, date });
    onSuccess();
    setAmount('');
    setDescription('');
    setDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="cursor" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" required />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <button   className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors duration-200"
 type="submit">Add Transaction</button>
    </form>
  );
}
