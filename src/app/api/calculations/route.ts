import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json({ calculations });
  } catch (error) {
    console.error('Error fetching calculations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined || result === null) {
      return NextResponse.json(
        { error: 'Expression and result are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = repo.create({
      expression: String(expression),
      result: String(result),
    });

    const saved = await repo.save(calculation);
    return NextResponse.json({ calculation: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving calculation:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    await repo.clear();
    return NextResponse.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}
