import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useSWR from 'swr';
import Home from '../page';
import { mockMarkets } from '../../lib/__mocks__/mockData';

// Mock SWR
jest.mock('swr');
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

// Mock the utility functions
jest.mock('../../lib/utils', () => ({
  sortByVolume24h: jest.fn((markets) => markets.slice(0, 2)),
  sortByPriceChange: jest.fn((markets) => markets.slice(0, 2)),
  filterMarkets: jest.fn((markets, query) =>
    query ? markets.filter(m => m.question.toLowerCase().includes(query.toLowerCase())) : markets
  ),
  formatVolume: jest.fn((volume) => `$${volume}`),
  formatPriceChange: jest.fn((change) => `${change}%`),
  formatDate: jest.fn((date) => '14个月后'),
  getMarketUrl: jest.fn((slug) => `https://polymarket.com/event/${slug}`),
}));

describe('Home Page', () => {
  beforeEach(() => {
    mockUseSWR.mockClear();
  });

  it('should render the main header and description', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    expect(screen.getByText('Polymarket Hype Radar')).toBeInTheDocument();
    expect(screen.getByText(/实时追踪最热门的预测市场/)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    expect(screen.getByText('正在加载市场数据...')).toBeInTheDocument();
    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument(); // Loading spinner
  });

  it('should show error state', () => {
    const mockError = new Error('API request failed');
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);
    
    expect(screen.getByText('加载失败')).toBeInTheDocument();
    expect(screen.getByText('API request failed')).toBeInTheDocument();
  });

  it('should render markets data successfully', () => {
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getByText('个市场')).toBeInTheDocument();
    expect(screen.getByText('数据来源:')).toBeInTheDocument();
    expect(screen.getByText('Polymarket')).toBeInTheDocument();
  });

  it('should handle tab switching', async () => {
    const user = userEvent.setup();
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    const trendingTab = screen.getByText(/涨幅榜/);
    await user.click(trendingTab);

    // The tab should be active (this would be tested through the TabSwitcher component)
    expect(trendingTab).toBeInTheDocument();
  });

  it('should handle search functionality', async () => {
    const user = userEvent.setup();
    const { filterMarkets } = require('../../lib/utils');

    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    const searchInput = screen.getByPlaceholderText(/搜索市场名称或分类/);
    await user.type(searchInput, 'Bitcoin');

    await waitFor(() => {
      expect(filterMarkets).toHaveBeenCalledWith(expect.any(Array), 'Bitcoin');
    });
  });

  it('should show search query in statistics', async () => {
    const user = userEvent.setup();
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    const searchInput = screen.getByPlaceholderText(/搜索市场名称或分类/);
    await user.type(searchInput, 'Bitcoin');

    await waitFor(() => {
      expect(screen.getByText('搜索:')).toBeInTheDocument();
      expect(screen.getByText('"Bitcoin"')).toBeInTheDocument();
    });
  });

  it('should configure SWR with correct options', () => {
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);
    
    expect(mockUseSWR).toHaveBeenCalledWith(
      '/api/markets?limit=100',
      expect.any(Function),
      {
        refreshInterval: 30000,
        revalidateOnFocus: false,
      }
    );
  });

  it('should render footer with correct links', () => {
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    expect(screen.getByText('开源项目')).toBeInTheDocument();
    expect(screen.getByText('完全免费')).toBeInTheDocument();
    expect(screen.getByText('数据来自 Polymarket 官方 API')).toBeInTheDocument();

    const apiDocsLink = screen.getByText('API 文档');
    expect(apiDocsLink).toHaveAttribute('href', 'https://docs.polymarket.com');
    expect(apiDocsLink).toHaveAttribute('target', '_blank');
  });

  it('should handle empty markets data', () => {
    mockUseSWR.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getByText('个市场')).toBeInTheDocument();
  });

  it('should use correct sorting based on active tab', () => {
    const { sortByVolume24h, sortByPriceChange } = require('../../lib/utils');

    // Clear previous mock calls
    sortByVolume24h.mockClear();
    sortByPriceChange.mockClear();

    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    // Default tab should use volume sorting
    expect(sortByVolume24h).toHaveBeenCalledWith(mockMarkets);
    expect(sortByPriceChange).not.toHaveBeenCalled();
  });

  it('should switch to price change sorting when trending tab is active', async () => {
    const user = userEvent.setup();
    const { sortByVolume24h, sortByPriceChange } = require('../../lib/utils');

    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    const trendingTab = screen.getByText(/涨幅榜/);
    await user.click(trendingTab);

    await waitFor(() => {
      expect(sortByPriceChange).toHaveBeenCalledWith(mockMarkets);
    });
  });

  it('should handle error without message', () => {
    const mockError = { name: 'Error' };
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);
    
    expect(screen.getByText('加载失败')).toBeInTheDocument();
    expect(screen.getByText('无法获取市场数据，请稍后重试')).toBeInTheDocument();
  });

  it('should render all main sections', () => {
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);
    
    // Header section
    expect(screen.getByRole('banner')).toBeInTheDocument();
    
    // Main content
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should have proper semantic HTML structure', () => {
    mockUseSWR.mockReturnValue({
      data: mockMarkets,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
      isValidating: false,
    });

    render(<Home />);

    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen');

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b', 'border-gray-200');
  });
});