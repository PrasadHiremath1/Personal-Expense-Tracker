
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transactions';

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json({ transactions });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  // Basic validation
  if (!body.amount || !body.description || !body.date || !body.category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newTransaction = await Transaction.create(body);
  return NextResponse.json({ transaction: newTransaction });
}
