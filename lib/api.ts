import { Market } from './types';

const API_BASE = 'https://gamma-api.polymarket.com';

/**
 * 获取活跃市场数据
 * @param limit 返回数量（默认 100）
 * @returns 市场数组
 */
export async function fetchActiveMarkets(limit = 100): Promise<Market[]> {
  try {
    const res = await fetch(
      `${API_BASE}/markets?closed=false&limit=${limit}`,
      {
        cache: 'no-store',
        next: { revalidate: 30 } // 30秒重新验证
      }
    );

    if (!res.ok) {
      throw new Error(`API 请求失败: ${res.status}`);
    }

    const data = await res.json();
    return data as Market[];
  } catch (error) {
    console.error('获取市场数据失败:', error);
    throw error;
  }
}

/**
 * 转换 API 数据格式以匹配类型定义
 */
export function transformMarketData(rawData: any): Market[] | any {
  // 如果不是数组，直接返回（例如错误响应）
  if (!Array.isArray(rawData)) {
    return rawData;
  }

  return rawData.map((market: any) => {
    // 从events提取分类或从问题中提取关键词
    let category = market.category || market.groupItemTitle || '';

    // 清理空字符串
    if (category && typeof category === 'string' && category.trim() === '') {
      category = '';
    }

    // 优先使用关键词匹配（更准确）
    if (!category || category === '') {
      const question = market.question || '';
      const q = question.toLowerCase();

      // 提取问题中的关键词
      if (q.includes('trump')) category = 'Politics';
      else if (q.includes('election')) category = 'Election';
      else if (q.includes('bitcoin') || q.includes('crypto')) category = 'Crypto';
      else if (q.includes('fed') || q.includes('rate') || q.includes('interest')) category = 'Economy';
      else if (q.includes('recession')) category = 'Economy';
      else if (q.includes('war') || q.includes('conflict')) category = 'Geopolitics';
      else if (q.includes('ai') || q.includes('artificial intelligence')) category = 'Technology';
      else if (q.includes('tether') || q.includes('usdt') || q.includes('depeg')) category = 'Crypto';
      else if (q.includes('ukraine') || q.includes('russia') || q.includes('nato')) category = 'Geopolitics';
      else {
        // 如果关键词没有匹配，尝试从events获取
        if (market.events && market.events.length > 0) {
          const eventTitle = market.events[0].title || '';
          const words = eventTitle.split(/[\s:-]+/).filter((w: string) => w.length > 2);
          category = words.slice(0, 2).join(' ') || 'General';
        } else {
          category = 'General';
        }
      }
    }

    // 确保category不是undefined
    if (category === undefined || category === null) {
      category = 'General';
    }

    // 否则从 API 原始格式转换
    return {
      id: market.id,
      question: market.question,
      conditionId: market.conditionId || '',
      slug: market.slug,
      endDate: market.endDate,

      // category 字段处理
      category: String(category),

      // 合并 AMM 和 CLOB 数据
      volume: String(Number(market.volumeAmm || 0) + Number(market.volumeClob || 0)),
      volume24hr: String(Number(market.volume24hrAmm || 0) + Number(market.volume24hrClob || 0)),
      volume1wk: String(Number(market.volume1wkAmm || 0) + Number(market.volume1wkClob || 0)),
      volume1mo: String(Number(market.volume1moAmm || 0) + Number(market.volume1moClob || 0)),
      volume1yr: market.volume1yr ? String(market.volume1yr) : undefined,
      liquidity: String(Number(market.liquidityAmm || 0) + Number(market.liquidityClob || 0)),

      marketType: market.marketType || 'binary',
      outcomes: market.outcomes,
      closed: market.closed,

      // 价格变化数据 - 转换为字符串
      oneDayPriceChange: String(market.oneDayPriceChange || 0),
      oneWeekPriceChange: String(market.oneWeekPriceChange || 0),
      oneMonthPriceChange: market.oneMonthPriceChange ? String(market.oneMonthPriceChange) : undefined,
      lastTradePrice: String(market.lastTradePrice || 0),
      bestBid: market.bestBid ? String(market.bestBid) : undefined,
      bestAsk: market.bestAsk ? String(market.bestAsk) : undefined,

      // Token IDs - 提供默认值
      tokens: market.tokens || '',

      // 可选字段
      description: market.description,
      icon: market.icon,
      image: market.image,
    } as Market;
  });
}

/**
 * 客户端 fetcher（用于 SWR）
 */
export const fetcher = async (url: string): Promise<Market[]> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 数据已经在 API 路由中转换，直接返回
    return data;
  } catch (error) {
    console.error('❌ Fetcher error:', error);
    throw error;
  }
};
