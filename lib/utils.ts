import { Market } from './types';

/**
 * 按 24 小时交易量排序
 */
export function sortByVolume24h(markets: Market[]): Market[] {
  return markets
    .filter(m => Number(m.volume24hr) > 0)
    .sort((a, b) => Number(b.volume24hr) - Number(a.volume24hr))
    .slice(0, 20);
}

/**
 * 按 7 天交易量排序
 */
export function sortByVolume7d(markets: Market[]): Market[] {
  return markets
    .filter(m => Number(m.volume1wk) > 0)
    .sort((a, b) => Number(b.volume1wk) - Number(a.volume1wk))
    .slice(0, 20);
}

/**
 * 按 24 小时价格变化排序（涨幅榜）
 */
export function sortByPriceChange(markets: Market[]): Market[] {
  return markets
    .filter(m => Number(m.oneDayPriceChange) !== 0)
    .sort((a, b) => Number(b.oneDayPriceChange) - Number(a.oneDayPriceChange))
    .slice(0, 20);
}

/**
 * 格式化交易量
 */
export function formatVolume(volume: string | number): string {
  const num = Number(volume);
  if (isNaN(num)) return '$0';
  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toFixed(0)}`;
}

/**
 * 格式化涨跌幅
 */
export function formatPriceChange(change: string | number): string {
  const num = Number(change);
  // 处理无效输入：NaN 或空字符串
  if (isNaN(num) || (typeof change === 'string' && change.trim() === '')) return '0.00%';
  const percent = (num * 100).toFixed(2);
  return num >= 0 ? `+${percent}%` : `${percent}%`;
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return '已结束';
  if (days === 0) return '今天';
  if (days === 1) return '明天';
  if (days < 7) return `${days}天后`;
  if (days < 30) return `${Math.floor(days / 7)}周后`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months}个月后`;
  }

  // 超过一年，显示年份
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  if (remainingMonths > 0) {
    return `${years}年${remainingMonths}个月后`;
  }
  return `${years}年后`;
}

/**
 * 生成 Polymarket 市场链接
 */
export function getMarketUrl(slug: string): string {
  return `https://polymarket.com/event/${slug}`;
}

/**
 * 搜索过滤
 */
export function filterMarkets(markets: Market[], query: string): Market[] {
  if (!query.trim()) return markets;

  const lowerQuery = query.toLowerCase();
  return markets.filter(m =>
    m.question.toLowerCase().includes(lowerQuery) ||
    m.category.toLowerCase().includes(lowerQuery)
  );
}
