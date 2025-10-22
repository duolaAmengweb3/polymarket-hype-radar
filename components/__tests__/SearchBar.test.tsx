import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render with default placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('搜索市场...');
    expect(input).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    const customPlaceholder = '自定义搜索提示';
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder={customPlaceholder} 
      />
    );
    
    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });

  it('should display the current value', () => {
    const testValue = 'Bitcoin';
    render(<SearchBar value={testValue} onChange={mockOnChange} />);
    
    const input = screen.getByDisplayValue(testValue);
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Trump');

    expect(mockOnChange).toHaveBeenCalledTimes(5); // One call per character
    expect(mockOnChange).toHaveBeenLastCalledWith('p'); // Last character typed
  });

  it('should call onChange when input is cleared', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="Bitcoin" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.clear(input);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('should handle onChange event correctly', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'AI' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('AI');
  });

  it('should have correct CSS classes for styling', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);

    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('relative');

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass(
      'w-full',
      'rounded-xl',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:border-transparent'
    );
  });

  it('should be focusable', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    input.focus();
    
    expect(input).toHaveFocus();
  });

  it('should handle special characters', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    const specialText = '2024年美国大选';
    await user.type(input, specialText);

    // Should be called for each character typed
    expect(mockOnChange).toHaveBeenCalled();
    // Last call should be the last character
    expect(mockOnChange).toHaveBeenLastCalledWith('选');
  });
});