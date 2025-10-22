import { NextResponse } from 'next/server';
import { transformMarketData } from '@/lib/api';

const API_BASE = 'https://gamma-api.polymarket.com';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';

    const response = await fetch(
      `${API_BASE}/markets?closed=false&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        // 禁用缓存以获取最新数据
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: response.status }
      );
    }

    const rawData = await response.json();

    // 转换数据格式
    const transformedData = transformMarketData(rawData);

    return NextResponse.json(transformedData, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
}
