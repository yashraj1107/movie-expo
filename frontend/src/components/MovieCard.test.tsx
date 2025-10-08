import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from './MovieCard';
import type { Movie } from '../types';

vi.mock('../hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: vi.fn().mockReturnValue(false),
    toggleFavorite: vi.fn(),
  }),
}));

const mockMovie: Movie = {
  id: 1, title: 'Inception', release_year: 2010, rating: 8.8, poster_url: 'http://example.com/poster.jpg',
  backdrop_url: '', synopsis: '', runtime_minutes: 148,
  director: { id: 1, name: 'Christopher Nolan' }, genres: [], actors: [],
};

describe('MovieCard Component', () => {
  it('renders movie title, year, and rating correctly', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('8.8')).toBeInTheDocument();
  });
});