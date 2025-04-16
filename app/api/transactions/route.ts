import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transactions';

// GET: Fetch all transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ date: -1 });
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST: Create a new transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { amount, description, date, category } = body;

    if (!amount || !description || !date || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const newTransaction = await Transaction.create({ amount, description, date, category });

    return NextResponse.json({ transaction: newTransaction }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
