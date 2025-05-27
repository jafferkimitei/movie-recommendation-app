/* eslint-disable @typescript-eslint/no-explicit-any */

import { render, screen } from '@testing-library/react';
import MovieCard from '@/components/MovieCard';
import Image from 'next/image';

// Mock Next.js components
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

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div className={`card ${className}`}>{children}</div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={`card-content ${className}`}>{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, className, ...props }: any) => (
    <button className={`button ${variant} ${className}`} {...props}>
      {children}
    </button>
  ),
}));

const mockMovieCardData = {
  id: 550,
  title: 'Fight Club',
  posterPath: '/fight-club-poster.jpg',
  overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.',
};

describe('MovieCard', () => {
  it('renders movie title and overview', () => {
    render(<MovieCard {...mockMovieCardData} />);
    
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText(/An insomniac office worker/)).toBeInTheDocument();
  });

  it('renders movie poster when posterPath is provided', () => {
    render(<MovieCard {...mockMovieCardData} />);
    
    const poster = screen.getByAltText('Fight Club');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/fight-club-poster.jpg');
  });

  it('renders placeholder image when posterPath is null', () => {
    const movieWithoutPoster = { ...mockMovieCardData, posterPath: null };
    render(<MovieCard {...movieWithoutPoster} />);
    
    const poster = screen.getByAltText('Fight Club');
    expect(poster).toHaveAttribute('src', '/placeholder.png');
  });

  it('creates correct link to movie details page', () => {
    render(<MovieCard {...mockMovieCardData} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/550');
  });

  it('renders View Details button', () => {
    render(<MovieCard {...mockMovieCardData} />);
    
    const button = screen.getByText('View Details');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('applies correct CSS classes', () => {
    render(<MovieCard {...mockMovieCardData} />);
    
    const card = screen.getByText('Fight Club').closest('.card');
    expect(card).toHaveClass('w-full', 'max-w-sm', 'rounded-2xl', 'shadow-lg', 'hover:scale-105', 'transition-transform');
  });

  it('handles long overview text', () => {
    const movieWithLongOverview = {
      ...mockMovieCardData,
      overview: 'This is a very long overview that should be truncated because it exceeds the normal length that would fit comfortably in a movie card component and needs to be handled gracefully.',
    };
    
    render(<MovieCard {...movieWithLongOverview} />);
    
    expect(screen.getByText(/This is a very long overview/)).toBeInTheDocument();
  });

  it('handles empty overview', () => {
    const movieWithEmptyOverview = {
      ...mockMovieCardData,
      overview: '',
    };
    
    render(<MovieCard {...movieWithEmptyOverview} />);
    
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('handles special characters in title and overview', () => {
    const movieWithSpecialChars = {
      ...mockMovieCardData,
      title: 'Movie: The "Special" Edition & More',
      overview: 'Overview with <script>alert("xss")</script> and special chars: @#$%^&*()',
    };
    
    render(<MovieCard {...movieWithSpecialChars} />);
    
    expect(screen.getByText('Movie: The "Special" Edition & More')).toBeInTheDocument();
    expect(screen.getByText(/Overview with.*and special chars/)).toBeInTheDocument();
  });
});
