import {
  sortByVolume24h,
  sortByVolume7d,
  sortByPriceChange,
  formatVolume,
  formatPriceChange,
  formatDate,
  getMarketUrl,
  filterMarkets,
} from '../utils';
import { mockMarkets } from '../__mocks__/mockData';

describe('Utils Functions', () => {
  describe('sortByVolume24h', () => {
    it('should sort markets by 24h volume in descending order', () => {
      const sorted = sortByVolume24h(mockMarkets);
      expect(sorted[0].volume24hr).toBe('800000');
      expect(sorted[1].volume24hr).toBe('500000');
      expect(sorted[2].volume24hr).toBe('200000');
    });

    it('should filter out markets with zero volume', () => {
      const marketsWithZero = [
        ...mockMarkets,
        { ...mockMarkets[0], id: '4', volume24hr: '0' },
      ];
      const sorted = sortByVolume24h(marketsWithZero);
      expect(sorted).toHaveLength(3);
      expect(sorted.every(m => Number(m.volume24hr) > 0)).toBe(true);
    });

    it('should limit results to 20 markets', () => {
      const manyMarkets = Array.from({ length: 25 }, (_, i) => ({
        ...mockMarkets[0],
        id: `market-${i}`,
        volume24hr: String((25 - i) * 1000),
      }));
      const sorted = sortByVolume24h(manyMarkets);
      expect(sorted).toHaveLength(20);
    });
  });

  describe('sortByVolume7d', () => {
    it('should sort markets by 7d volume in descending order', () => {
      const sorted = sortByVolume7d(mockMarkets);
      expect(sorted[0].volume1wk).toBe('3000000');
      expect(sorted[1].volume1wk).toBe('2000000');
      expect(sorted[2].volume1wk).toBe('800000');
    });
  });

  describe('sortByPriceChange', () => {
    it('should sort markets by price change in descending order', () => {
      const sorted = sortByPriceChange(mockMarkets);
      expect(sorted[0].oneDayPriceChange).toBe('0.15');
      expect(sorted[1].oneDayPriceChange).toBe('0.05');
      expect(sorted[2].oneDayPriceChange).toBe('-0.03');
    });

    it('should filter out markets with zero price change', () => {
      const marketsWithZero = [
        ...mockMarkets,
        { ...mockMarkets[0], id: '4', oneDayPriceChange: '0' },
      ];
      const sorted = sortByPriceChange(marketsWithZero);
      expect(sorted).toHaveLength(3);
      expect(sorted.every(m => Number(m.oneDayPriceChange) !== 0)).toBe(true);
    });
  });

  describe('formatVolume', () => {
    it('should format large volumes with M suffix', () => {
      expect(formatVolume('5000000')).toBe('$5.0M');
      expect(formatVolume(10500000)).toBe('$10.5M');
    });

    it('should format thousands with K suffix', () => {
      expect(formatVolume('5000')).toBe('$5.0K');
      expect(formatVolume(1500)).toBe('$1.5K');
    });

    it('should format small amounts without suffix', () => {
      expect(formatVolume('500')).toBe('$500');
      expect(formatVolume(99)).toBe('$99');
    });

    it('should handle invalid input', () => {
      expect(formatVolume('invalid')).toBe('$0');
      expect(formatVolume('')).toBe('$0');
    });
  });

  describe('formatPriceChange', () => {
    it('should format positive changes with + sign', () => {
      expect(formatPriceChange('0.05')).toBe('+5.00%');
      expect(formatPriceChange(0.123)).toBe('+12.30%');
    });

    it('should format negative changes without extra sign', () => {
      expect(formatPriceChange('-0.03')).toBe('-3.00%');
      expect(formatPriceChange(-0.075)).toBe('-7.50%');
    });

    it('should handle zero change', () => {
      expect(formatPriceChange('0')).toBe('+0.00%');
      expect(formatPriceChange(0)).toBe('+0.00%');
    });

    it('should handle invalid input', () => {
      expect(formatPriceChange('invalid')).toBe('0.00%');
      expect(formatPriceChange('')).toBe('0.00%');
    });
  });

  describe('formatDate', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should show "已结束" for past dates', () => {
      const pastDate = '2023-12-31T00:00:00Z';
      expect(formatDate(pastDate)).toBe('已结束');
    });

    it('should show "今天" for same day', () => {
      const today = '2024-01-01T23:59:59Z';
      expect(formatDate(today)).toBe('今天');
    });

    it('should show "明天" for next day', () => {
      const tomorrow = '2024-01-02T12:00:00Z';
      expect(formatDate(tomorrow)).toBe('明天');
    });

    it('should show days for less than a week', () => {
      const threeDays = '2024-01-04T00:00:00Z';
      expect(formatDate(threeDays)).toBe('3天后');
    });

    it('should show weeks for less than a month', () => {
      const twoWeeks = '2024-01-15T00:00:00Z';
      expect(formatDate(twoWeeks)).toBe('2周后');
    });

    it('should show months for longer periods', () => {
      const twoMonths = '2024-03-01T00:00:00Z';
      expect(formatDate(twoMonths)).toBe('2个月后');
    });

    it('should show years for very long periods', () => {
      const oneYear = '2025-01-01T00:00:00Z';
      expect(formatDate(oneYear)).toBe('1年后');
    });
  });

  describe('getMarketUrl', () => {
    it('should generate correct Polymarket URL', () => {
      const slug = 'bitcoin-100k-2024';
      const expected = 'https://polymarket.com/event/bitcoin-100k-2024';
      expect(getMarketUrl(slug)).toBe(expected);
    });

    it('should handle empty slug', () => {
      const expected = 'https://polymarket.com/event/';
      expect(getMarketUrl('')).toBe(expected);
    });
  });

  describe('filterMarkets', () => {
    it('should return all markets when query is empty', () => {
      expect(filterMarkets(mockMarkets, '')).toEqual(mockMarkets);
      expect(filterMarkets(mockMarkets, '   ')).toEqual(mockMarkets);
    });

    it('should filter by question text', () => {
      const filtered = filterMarkets(mockMarkets, 'Bitcoin');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].question).toContain('Bitcoin');
    });

    it('should filter by category', () => {
      const filtered = filterMarkets(mockMarkets, 'Crypto');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('Crypto');
    });

    it('should be case insensitive', () => {
      const filtered = filterMarkets(mockMarkets, 'TRUMP');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].question.toLowerCase()).toContain('trump');
    });

    it('should return empty array when no matches', () => {
      const filtered = filterMarkets(mockMarkets, 'nonexistent');
      expect(filtered).toHaveLength(0);
    });

    it('should match partial strings', () => {
      const filtered = filterMarkets(mockMarkets, 'AI');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].question).toContain('AI');
    });
  });
});