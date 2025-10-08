import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Movie } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import MovieList from '../components/MovieList';

const FavoritesPage = () => {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const { favorites } = useFavorites();

    useEffect(() => {
        // Fetch all movies to then filter locally. 
        // In a very large-scale app, you might create a dedicated endpoint to fetch only favorited movies by ID.
        axios.get('/api/movies').then(res => setAllMovies(res.data));
    }, []);

    const favoriteMovies = allMovies.filter(movie => favorites.includes(movie.id));

    return (
        <div className="container mx-auto px-4 py-8">
            <br/>
            <br/>
            <h2 className="text-2xl font-bold text-white mb-6">Your Favorites</h2>
            {favoriteMovies.length > 0 
                ? <MovieList movies={favoriteMovies} /> 
                : <p className="text-gray-400">You haven't added any favorites yet. Click the heart icon on a movie to add it!</p>
            }
        </div>
    );
};
export default FavoritesPage;