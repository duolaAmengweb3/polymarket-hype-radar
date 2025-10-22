import { fetchActiveMarkets, fetcher } from '../api';
import { mockMarkets } from '../__mocks__/mockData';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchActiveMarkets', () => {
    it('should fetch active markets successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkets,
      });

      const result = await fetchActiveMarkets();
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gamma-api.polymarket.com/markets?closed=false&limit=100',
        {
          cache: 'no-store',
          next: { revalidate: 30 },
        }
      );
      expect(result).toEqual(mockMarkets);
    });

    it('should use custom limit parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkets,
      });

      await fetchActiveMarkets(50);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'https://gamma-api.polymarket.com/markets?closed=false&limit=50',
        expect.any(Object)
      );
    });

    it('should throw error when API request fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchActiveMarkets()).rejects.toThrow('API 请求失败: 500');
    });

    it('should throw error when fetch fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(fetchActiveMarkets()).rejects.toThrow('Network error');
    });

    it('should handle JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(fetchActiveMarkets()).rejects.toThrow('Invalid JSON');
    });
  });

  describe('fetcher', () => {
    it('should fetch and parse JSON successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMarkets,
      });

      const result = await fetcher('https://example.com/api');
      
      expect(mockFetch).toHaveBeenCalledWith('https://example.com/api');
      expect(result).toEqual(mockMarkets);
    });

    it('should throw error when fetch fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(fetcher('https://example.com/api')).rejects.toThrow('Network error');
    });

    it('should handle non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      await expect(fetcher('https://example.com/api')).rejects.toThrow('HTTP error! status: 404');
    });
  });
});