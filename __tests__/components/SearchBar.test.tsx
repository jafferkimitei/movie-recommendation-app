/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';


jest.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, value, onChange, className, ...props }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  ),
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search for a movie...')).toBeInTheDocument();
  });

  it('calls onSearch when input value changes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(input, { target: { value: 'Inception' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('Inception');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a movie...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'The Matrix' } });
    
    expect(input.value).toBe('The Matrix');
  });

  it('calls onSearch with empty string when input is cleared', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.change(input, { target: { value: '' } });
    
    expect(mockOnSearch).toHaveBeenLastCalledWith('');
    expect(mockOnSearch).toHaveBeenCalledTimes(2);
  });

  it('handles multiple rapid changes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.change(input, { target: { value: 'Av' } });
    fireEvent.change(input, { target: { value: 'Avengers' } });
    
    expect(mockOnSearch).toHaveBeenCalledTimes(3);
    expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'A');
    expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'Av');
    expect(mockOnSearch).toHaveBeenNthCalledWith(3, 'Avengers');
  });

  it('applies correct CSS classes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a movie...');
    expect(input).toHaveClass('max-w-md');
  });
});