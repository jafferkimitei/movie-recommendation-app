/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import MovieDetails from '@/components/MovieDetails';

// Mock Next.js Image component
jest.mock('next/image', () => {
  const Image = require('next/image').default;
  return {
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
  };
});

// Mock UI components
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span className={`badge ${variant}`}>{children}</span>
  ),
}));

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => (
    <div className={`skeleton ${className}`}>Loading...</div>
  ),
}));

const mockMovieData = {
  title: 'Inception',
  posterPath: '/inception-poster.jpg',
  overview: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
  genres: [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Sci-Fi' },
    { id: 3, name: 'Thriller' }
  ],
  rating: 8.8,
  releaseDate: '2010-07-16',
  cast: [
    { id: 1, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: '/leo.jpg' },
    { id: 2, name: 'Marion Cotillard', character: 'Mal', profile_path: '/marion.jpg' },
    { id: 3, name: 'Tom Hardy', character: 'Eames', profile_path: null },
    { id: 4, name: 'Ellen Page', character: 'Ariadne', profile_path: '/ellen.jpg' },
  ],
  crew: [
    { id: 1, name: 'Christopher Nolan', job: 'Director' },
    { id: 2, name: 'Emma Thomas', job: 'Producer' },
    { id: 3, name: 'Wally Pfister', job: 'Director of Photography' },
  ]
};

describe('MovieDetails', () => {
  it('renders movie title and basic information', () => {
    render(<MovieDetails {...mockMovieData} />);
    
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Release Date: 2010-07-16')).toBeInTheDocument();
    expect(screen.getByText('Rating: 8.8/10')).toBeInTheDocument();
    expect(screen.getByText(mockMovieData.overview)).toBeInTheDocument();
  });

  it('renders movie poster when posterPath is provided', () => {
    render(<MovieDetails {...mockMovieData} />);
    
    const poster = screen.getByAltText('Inception');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/inception-poster.jpg');
  });

  it('renders skeleton when posterPath is null', () => {
    const movieWithoutPoster = { ...mockMovieData, posterPath: null };
    render(<MovieDetails {...movieWithoutPoster} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByAltText('Inception')).not.toBeInTheDocument();
  });

  it('renders all genres as badges', () => {
    render(<MovieDetails {...mockMovieData} />);
    
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Thriller')).toBeInTheDocument();
  });

  it('renders top cast with profile images', () => {
    render(<MovieDetails {...mockMovieData} />);
    
    expect(screen.getByText('Top Cast')).toBeInTheDocument();
    expect(screen.getByText('Leonardo DiCaprio as Dom Cobb')).toBeInTheDocument();
    expect(screen.getByText('Marion Cotillard as Mal')).toBeInTheDocument();
    
    const leoImage = screen.getByAltText('Leonardo DiCaprio');
    expect(leoImage).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w92/leo.jpg');
  });

  it('renders skeleton for cast members without profile images', () => {
    render(<MovieDetails {...mockMovieData} />);
    
    expect(screen.getByText('Tom Hardy as Eames')).toBeInTheDocument();
    // Should have skeleton for Tom Hardy since profile_path is null
    const skeletons = screen.getAllByText('Loading...');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('limits cast display to 6 members', () => {
    const movieWithManyCast = {
      ...mockMovieData,
      cast: [
        ...mockMovieData.cast,
        { id: 5, name: 'Actor 5', character: 'Character 5', profile_path: '/actor5.jpg' },
        { id: 6, name: 'Actor 6', character: 'Character 6', profile_path: '/actor6.jpg' },
        { id: 7, name: 'Actor 7', character: 'Character 7', profile_path: '/actor7.jpg' },
        { id: 8, name: 'Actor 8', character: 'Character 8', profile_path: '/actor8.jpg' },
      ]
    };
    
    render(<MovieDetails {...movieWithManyCast} />);
    
    // Should only show first 6 cast members
    expect(screen.getByText('Leonardo DiCaprio as Dom Cobb')).toBeInTheDocument();
    expect(screen.getByText('Actor 6 as Character 6')).toBeInTheDocument();
    expect(screen.queryByText('Actor 7 as Character 7')).not.toBeInTheDocument();
    expect(screen.queryByText('Actor 8 as Character 8')).not.toBeInTheDocument();
  });

  it('renders crew information', () => {
    render(<MovieDetails {...mockMovieData} />);
    
    expect(screen.getByText('Crew')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan (Director)')).toBeInTheDocument();
    expect(screen.getByText('Emma Thomas (Producer)')).toBeInTheDocument();
  });

  it('limits crew display to 5 members', () => {
    const movieWithManyCrew = {
      ...mockMovieData,
      crew: [
        ...mockMovieData.crew,
        { id: 4, name: 'Crew 4', job: 'Job 4' },
        { id: 5, name: 'Crew 5', job: 'Job 5' },
        { id: 6, name: 'Crew 6', job: 'Job 6' },
      ]
    };
    
    render(<MovieDetails {...movieWithManyCrew} />);
    
    expect(screen.getByText('Crew 5 (Job 5)')).toBeInTheDocument();
    expect(screen.queryByText('Crew 6 (Job 6)')).not.toBeInTheDocument();
  });

  it('handles empty arrays gracefully', () => {
    const movieWithEmptyArrays = {
      ...mockMovieData,
      genres: [],
      cast: [],
      crew: []
    };
    
    render(<MovieDetails {...movieWithEmptyArrays} />);
    
    expect(screen.getByText('Top Cast')).toBeInTheDocument();
    expect(screen.getByText('Crew')).toBeInTheDocument();
    // Should not crash and should still render other content
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });
});
