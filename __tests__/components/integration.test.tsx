/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import MovieDetails from '@/components/MovieDetails';
import { useState } from 'react';
import Image from 'next/image';

// Mock all the same components as in individual tests
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

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: any) => (
    <Image
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => (
    <a href={href}>{children}</a>
  ),
}));

// Additional mocks for integration tests
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, className, ...props }: any) => (
    <button className={`${variant} ${className}`} {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => <span className={variant}>{children}</span>,
}));

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className}>Loading...</div>,
}));

describe('Integration Tests', () => {
  it('SearchBar integrates with parent component search functionality', () => {
    const movies = [
      { id: 1, title: 'Inception', posterPath: '/inception.jpg', overview: 'Dream movie' },
      { id: 2, title: 'The Matrix', posterPath: '/matrix.jpg', overview: 'Reality movie' },
    ];

    const TestApp = () => {
      const [filteredMovies, setFilteredMovies] = useState(movies);

      const handleSearch = (query: string) => {
        const filtered = movies.filter(movie => 
          movie.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMovies(filtered);
      };

      return (
        <div>
          <SearchBar onSearch={handleSearch} />
          <div data-testid="movie-list">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </div>
      );
    };

    render(<TestApp />);

    // Initially shows all movies
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('The Matrix')).toBeInTheDocument();

    // Filter by search
    const searchInput = screen.getByPlaceholderText('Search for a movie...');
    fireEvent.change(searchInput, { target: { value: 'Matrix' } });

    // Should only show Matrix movie
    expect(screen.queryByText('Inception')).not.toBeInTheDocument();
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
  });

  it('MovieCard navigates to MovieDetails correctly', () => {
    const movieData = {
      id: 550,
      title: 'Fight Club',
      posterPath: '/fight-club.jpg',
      overview: 'Underground fighting',
    };

    render(<MovieCard {...movieData} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/550');
  });

  it('All components handle missing data gracefully', () => {
    // Test SearchBar with undefined onSearch (should not crash)
    const { rerender } = render(<SearchBar onSearch={() => {}} />);
    
    // Test MovieCard with minimal data
    const minimalMovieData = {
      id: 1,
      title: '',
      posterPath: null,
      overview: '',
    };
    
    rerender(<MovieCard {...minimalMovieData} />);
    expect(screen.getByText('View Details')).toBeInTheDocument();

    // Test MovieDetails with minimal data
    const minimalDetailsData = {
      title: '',
      posterPath: null,
      overview: '',
      genres: [],
      rating: 0,
      releaseDate: '',
      cast: [],
      crew: [],
    };

    rerender(<MovieDetails {...minimalDetailsData} />);
    expect(screen.getByText('Top Cast')).toBeInTheDocument();
  });
});
