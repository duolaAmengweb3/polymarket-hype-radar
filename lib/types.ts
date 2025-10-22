// Polymarket API 返回的市场数据类型
export interface Market {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  endDate: string;
  category: string;
  volume: string;
  volume24hr: string;
  volume1wk: string;
  volume1mo: string;
  volume1yr?: string;
  liquidity: string;
  marketType: string;
  outcomes: string;
  closed: boolean;

  // 价格变化数据
  oneDayPriceChange: string;
  oneWeekPriceChange: string;
  oneMonthPriceChange?: string;
  lastTradePrice: string;
  bestBid?: string;
  bestAsk?: string;

  // Token IDs（用于价格历史查询）
  tokens: string;

  // 其他可选字段
  description?: string;
  icon?: string;
  image?: string;
}

// 排序类型
export type SortType = 'volume24h' | 'volume7d' | 'priceChange';

// 标签类型
export type TabType = 'hot' | 'trending';
