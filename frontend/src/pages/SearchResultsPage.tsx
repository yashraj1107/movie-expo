import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import type { Movie } from '../types';
import MovieList from '../components/MovieList';

const SearchResultsPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        if (query) {
            axios.get(`/api/search/movies?q=${query}`)
                .then(res => setMovies(res.data));
        }
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-white mb-6">
                Search Results for: <span className="text-cyan-400">{query}</span>
            </h2>
            {movies.length > 0 ? <MovieList movies={movies} /> : <p className="text-gray-400">No results found for your search.</p>}
        </div>
    );
};
export default SearchResultsPage;