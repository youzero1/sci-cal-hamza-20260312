import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/db';
import { Calculation } from '@/entities/Calculation';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return NextResponse.json({ calculations });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
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
        { error: 'expression and result are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calc = repo.create({
      expression: String(expression),
      result: String(result),
    });

    const saved = await repo.save(calc);
    return NextResponse.json({ calculation: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/history error:', error);
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
    return NextResponse.json({ message: 'History cleared' });
  } catch (error) {
    console.error('DELETE /api/history error:', error);
    return NextResponse.json(
      { error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}
