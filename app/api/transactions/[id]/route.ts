import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transactions';

// DELETE /api/transactions/:id
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from URL

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/transactions/:id
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split('/').pop(); // Extract ID from URL
    const body = await req.json();

    if (!body.amount || !body.description || !body.date || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, body, { new: true });

    if (!updatedTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
