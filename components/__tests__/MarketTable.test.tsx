import { render, screen } from '@testing-library/react';
import MarketTable from '../MarketTable';
import { mockMarkets, mockEmptyMarkets } from '../../lib/__mocks__/mockData';

// Mock the utils functions
jest.mock('../../lib/utils', () => ({
  formatVolume: jest.fn((volume) => `$${volume}`),
  formatPriceChange: jest.fn((change) => `${change}%`),
  formatDate: jest.fn((date) => '14个月后'),
  getMarketUrl: jest.fn((slug) => `https://polymarket.com/event/${slug}`),
}));

describe('MarketTable Component', () => {
  it('should render empty state when no markets provided', () => {
    render(<MarketTable markets={mockEmptyMarkets} />);
    
    expect(screen.getByText('暂无市场数据')).toBeInTheDocument();
  });

  it('should render market data in volume mode', () => {
    render(<MarketTable markets={mockMarkets} showPriceChange={false} />);
    
    // Check table headers for volume mode
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('市场')).toBeInTheDocument();
    expect(screen.getByText('分类')).toBeInTheDocument();
    expect(screen.getByText('24h 交易量')).toBeInTheDocument();
    expect(screen.getByText('7d 交易量')).toBeInTheDocument();
    expect(screen.getByText('结束时间')).toBeInTheDocument();
  });

  it('should render market data in price change mode', () => {
    render(<MarketTable markets={mockMarkets} showPriceChange={true} />);
    
    // Check table headers for price change mode
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('市场')).toBeInTheDocument();
    expect(screen.getByText('分类')).toBeInTheDocument();
    expect(screen.getByText('24h 涨跌')).toBeInTheDocument();
    expect(screen.getByText('结束时间')).toBeInTheDocument();
    
    // Should not show volume columns
    expect(screen.queryByText('24h 交易量')).not.toBeInTheDocument();
    expect(screen.queryByText('7d 交易量')).not.toBeInTheDocument();
  });

  it('should render market questions as clickable links', () => {
    render(<MarketTable markets={mockMarkets} />);
    
    const firstMarketLink = screen.getByText(mockMarkets[0].question);
    expect(firstMarketLink).toBeInTheDocument();
    expect(firstMarketLink.closest('a')).toHaveAttribute(
      'href',
      `https://polymarket.com/event/${mockMarkets[0].slug}`
    );
    expect(firstMarketLink.closest('a')).toHaveAttribute('target', '_blank');
    expect(firstMarketLink.closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render market categories', () => {
    render(<MarketTable markets={mockMarkets} />);
    
    mockMarkets.forEach(market => {
      expect(screen.getByText(market.category)).toBeInTheDocument();
    });
  });

  it('should render row numbers correctly', () => {
    render(<MarketTable markets={mockMarkets} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render volume data when showPriceChange is false', () => {
    const { formatVolume } = require('@/lib/utils');
    render(<MarketTable markets={mockMarkets} showPriceChange={false} />);
    
    expect(formatVolume).toHaveBeenCalledWith(mockMarkets[0].volume24hr);
    expect(formatVolume).toHaveBeenCalledWith(mockMarkets[0].volume1wk);
  });

  it('should render price change data when showPriceChange is true', () => {
    const { formatPriceChange } = require('@/lib/utils');
    render(<MarketTable markets={mockMarkets} showPriceChange={true} />);
    
    expect(formatPriceChange).toHaveBeenCalledWith(mockMarkets[0].oneDayPriceChange);
  });

  it('should apply correct styling for positive price changes', () => {
    render(<MarketTable markets={mockMarkets} showPriceChange={true} />);

    // Find the price change cell for the first market (positive change)
    const priceChangeElements = screen.getAllByText(/0.05%/);
    const positiveChangeElement = priceChangeElements[0];

    expect(positiveChangeElement).toHaveClass('from-green-500', 'to-emerald-500', 'text-white');
    expect(positiveChangeElement).not.toHaveClass('from-red-500');
  });

  it('should apply correct styling for negative price changes', () => {
    render(<MarketTable markets={mockMarkets} showPriceChange={true} />);

    // Find the price change cell for the second market (negative change)
    const priceChangeElements = screen.getAllByText(/-0.03%/);
    const negativeChangeElement = priceChangeElements[0];

    expect(negativeChangeElement).toHaveClass('from-red-500', 'to-pink-500', 'text-white');
    expect(negativeChangeElement).not.toHaveClass('from-green-500');
  });

  it('should render formatted dates', () => {
    const { formatDate } = require('@/lib/utils');
    render(<MarketTable markets={mockMarkets} />);
    
    mockMarkets.forEach(market => {
      expect(formatDate).toHaveBeenCalledWith(market.endDate);
    });
  });

  it('should have proper table structure', () => {
    render(<MarketTable markets={mockMarkets} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // 1 header + 3 data rows
  });

  it('should have hover effects on table rows', () => {
    render(<MarketTable markets={mockMarkets} />);

    const dataRows = screen.getAllByRole('row').slice(1); // Skip header row
    dataRows.forEach(row => {
      expect(row).toHaveClass('hover:bg-blue-50/50', 'transition-colors');
    });
  });

  it('should handle empty market data gracefully', () => {
    render(<MarketTable markets={[]} />);
    
    expect(screen.getByText('暂无市场数据')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    render(<MarketTable markets={mockMarkets} />);

    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('overflow-x-auto');

    const table = screen.getByRole('table');
    expect(table).toHaveClass('w-full');
  });

  it('should handle single market correctly', () => {
    const singleMarket = [mockMarkets[0]];
    render(<MarketTable markets={singleMarket} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText(singleMarket[0].question)).toBeInTheDocument();
  });
});