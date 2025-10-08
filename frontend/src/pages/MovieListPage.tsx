import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { Movie } from '../types';
import Hero from '../components/Hero';
import MovieCard from '../components/MovieCard';
import MovieCardSkeleton from '../components/MovieCardSkeleton';
import FilterBar from '../components/FilterBar';
import AdvancedFilter from '../components/AdvancedFilter';

const initialFilters = {
    genreId: '', directorId: '', actorId: '', year: '',
};

const MovieListPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState(initialFilters);
    // 1. State for the new sorting feature is added
    const [sortBy, setSortBy] = useState('rating_desc');

    // 2. useEffect is updated to also depend on 'sortBy'
    useEffect(() => {
        setLoading(true);
        const toastId = toast.loading('Fetching movies...');

        const params = new URLSearchParams();
        if (filters.genreId) params.append('genre_id', filters.genreId);
        if (filters.directorId) params.append('director_id', filters.directorId);
        if (filters.actorId) params.append('actor_id', filters.actorId);
        if (filters.year) params.append('year', filters.year);
        params.append('sort_by', sortBy); // Add the sort parameter to the API call
        
        const apiUrl = `/api/movies?${params.toString()}`;
        
        axios.get(apiUrl)
            .then(response => {
                const fetchedMovies = response.data;
                setMovies(fetchedMovies);
                if (heroMovies.length === 0) {
                    setHeroMovies(fetchedMovies.slice(0, 5));
                }
                toast.success('Movies loaded!', { id: toastId });
                if (fetchedMovies.length === 0 && (filters.genreId || filters.directorId || filters.actorId || filters.year)) {
                    toast('No movies found for these filters.', { icon: '🎬' });
                }
            })
            .catch(() => toast.error('Failed to load movies.', { id: toastId }))
            .finally(() => setLoading(false));
    }, [filters, sortBy, heroMovies.length]); 
    
    const renderContent = () => {
        if (loading && movies.length === 0) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)}
                </div>
            );
        }
        if (movies.length === 0 && !loading) {
            return <div className="text-center p-10 text-gray-500">No movies found. Try clearing your filters.</div>;
        }
        return <MovieList movies={movies} />;
    };

    const handleGenreChange = (genreId: string) => setFilters({ ...initialFilters, genreId });
    const handleApplyAdvancedFilters = (newFilters: { directorId: string; actorId: string; year: string; }) => {
        setFilters(prev => ({ ...prev, ...newFilters, genreId: '' }));
    };
    const handleClearFilters = () => {
        setFilters(initialFilters);
        toast.success('Filters cleared!');
    };

    return (
        <div>
            <Hero movies={heroMovies} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Popular Movies</h2>
                    {/* 3. The UI for sorting and advanced filters is added here */}
                    <div className="flex items-center gap-4">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            aria-label="Sort movies"
                        >
                            <option value="rating_desc">Sort: Rating High to Low</option>
                            <option value="rating_asc">Sort: Rating Low to High</option>
                        </select>
                        <AdvancedFilter 
                            onApplyFilters={handleApplyAdvancedFilters} 
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </div>
                <div className="mb-8">
                    <FilterBar
                        selectedGenreId={filters.genreId}
                        onGenreChange={handleGenreChange}
                    />
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

const MovieList = ({ movies }: { movies: Movie[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
    </div>
);

export default MovieListPage;

