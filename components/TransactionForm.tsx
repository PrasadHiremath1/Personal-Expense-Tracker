
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/transactions', {
      amount: Number(amount),
      description,
      date,
      category,
    });
    onSuccess();
    setAmount('');
    setDescription('');
    setDate('');
    setCategory(categories[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Select value={category} onValueChange={(value: string) => setCategory(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat, index) => (
            <SelectItem key={index} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Add Transaction</Button>
    </form>
  );
}
