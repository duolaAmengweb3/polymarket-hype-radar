import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabSwitcher from '../TabSwitcher';
import { TabType } from '@/lib/types';

describe('TabSwitcher Component', () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    mockOnTabChange.mockClear();
  });

  it('should render both tab buttons', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    expect(screen.getByText(/热门榜/)).toBeInTheDocument();
    expect(screen.getByText(/涨幅榜/)).toBeInTheDocument();
  });

  it('should highlight the active tab', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');
    const hotButton = buttons[0];
    const trendingButton = buttons[1];

    expect(hotButton).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
    expect(trendingButton).toHaveClass('text-gray-600');
  });

  it('should highlight trending tab when active', () => {
    render(<TabSwitcher activeTab="trending" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');
    const hotButton = buttons[0];
    const trendingButton = buttons[1];

    expect(trendingButton).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
    expect(hotButton).toHaveClass('text-gray-600');
  });

  it('should call onTabChange when hot tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TabSwitcher activeTab="trending" onTabChange={mockOnTabChange} />);

    const hotButton = screen.getByText(/热门榜/).closest('button');
    if (hotButton) await user.click(hotButton);

    expect(mockOnTabChange).toHaveBeenCalledWith('hot');
  });

  it('should call onTabChange when trending tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const trendingButton = screen.getByText(/涨幅榜/).closest('button');
    if (trendingButton) await user.click(trendingButton);

    expect(mockOnTabChange).toHaveBeenCalledWith('trending');
  });

  it('should handle click events with fireEvent', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const trendingButton = screen.getByText(/涨幅榜/).closest('button');
    if (trendingButton) fireEvent.click(trendingButton);

    expect(mockOnTabChange).toHaveBeenCalledWith('trending');
  });

  it('should have correct container styling', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');
    const container = buttons[0].parentElement;
    expect(container).toHaveClass('flex', 'gap-3');
  });

  it('should have correct button styling', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');

    // Common classes for both buttons
    buttons.forEach(button => {
      expect(button).toHaveClass(
        'px-6',
        'py-3',
        'font-semibold',
        'text-sm',
        'rounded-lg'
      );
    });
  });

  it('should show hover effects on inactive tab', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');
    const trendingButton = buttons[1]; // Inactive tab
    expect(trendingButton).toHaveClass('hover:text-gray-900', 'hover:bg-gray-100');
  });

  it('should be accessible with proper button roles', () => {
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    expect(buttons[0]).toHaveTextContent(/热门榜/);
    expect(buttons[1]).toHaveTextContent(/涨幅榜/);
  });

  it('should handle rapid tab switching', async () => {
    const user = userEvent.setup();
    render(<TabSwitcher activeTab="hot" onTabChange={mockOnTabChange} />);

    const buttons = screen.getAllByRole('button');
    const hotButton = buttons[0];
    const trendingButton = buttons[1];

    await user.click(trendingButton);
    await user.click(hotButton);
    await user.click(trendingButton);

    expect(mockOnTabChange).toHaveBeenCalledTimes(3);
    expect(mockOnTabChange).toHaveBeenNthCalledWith(1, 'trending');
    expect(mockOnTabChange).toHaveBeenNthCalledWith(2, 'hot');
    expect(mockOnTabChange).toHaveBeenNthCalledWith(3, 'trending');
  });
});
