import { NextRequest, NextResponse } from 'next/server';
import { searchLocation } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    const data = await searchLocation(q);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API geocode error:', error);
    return NextResponse.json({ error: 'Failed to search location' }, { status: 500 });
  }
}
