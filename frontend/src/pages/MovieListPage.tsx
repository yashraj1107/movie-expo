import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Movie } from '../types';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import FilterBar from '../components/FilterBar';
import AdvancedFilter from '../components/AdvancedFilter';

const MovieListPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ genreId: '', directorId: '', actorId: '', year: '' });

    useEffect(() => {
        setLoading(true);
        const toastId = toast.loading('Fetching movies...');

        const params = new URLSearchParams();
        if (filters.genreId) params.append('genre_id', filters.genreId);
        if (filters.directorId) params.append('director_id', filters.directorId);
        if (filters.actorId) params.append('actor_id', filters.actorId);
        if (filters.year) params.append('year', filters.year);
        
        const apiUrl = `/api/movies?${params.toString()}`;
        
        axios.get(apiUrl)
            .then(response => {
                const fetchedMovies = response.data;
                setMovies(fetchedMovies);

                if (heroMovies.length === 0 && Object.values(filters).every(f => !f)) {
                    setHeroMovies(fetchedMovies.slice(0, 5));
                }

                toast.success('Movies loaded!', { id: toastId });
                if (fetchedMovies.length === 0) {
                    toast('No movies found.', { icon: '🎬' });
                }
            })
            .catch(() => toast.error('Failed to load movies.', { id: toastId }))
            .finally(() => setLoading(false));
    }, [filters]);
    
    const renderContent = () => {
        if (loading && movies.length === 0) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)}
                </div>
            );
        }
        if (movies.length === 0 && !loading) {
            return <div className="text-center p-10 text-gray-500">No movies found.</div>;
        }
        return <MovieList movies={movies} />;
    };

    const handleGenreChange = (genreId: string) => { setFilters({ genreId, directorId: '', actorId: '', year: '' }); };
    const handleApplyAdvancedFilters = (newFilters: { directorId: string; actorId: string; year: string; }) => {
        setFilters(prev => ({ ...prev, ...newFilters, genreId: '' }));
    };
    const handleClearFilters = () => { setFilters({ genreId: '', directorId: '', actorId: '', year: '' }); };

    return (
        <div>
            <Hero movies={heroMovies} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
                    <AdvancedFilter onApplyFilters={handleApplyAdvancedFilters} onClearFilters={handleClearFilters} />
                </div>
                <div className="mb-8">
                    <FilterBar selectedGenreId={filters.genreId} onGenreChange={handleGenreChange} />
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

const MovieList = ({ movies }: { movies: Movie[] }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map(movie => ( <MovieCard key={movie.id} movie={movie} /> ))}
        </div>
    );
};
export default MovieListPage;