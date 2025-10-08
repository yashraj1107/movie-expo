import { useState, useEffect } from 'react';

const getFavoritesFromStorage = (): number[] => {
    const favorites = localStorage.getItem('favoriteMovies');
    return favorites ? JSON.parse(favorites) : [];
};

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<number[]>(getFavoritesFromStorage());

    useEffect(() => {
        localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
    }, [favorites]);

    const isFavorite = (movieId: number) => favorites.includes(movieId);

    const toggleFavorite = (movieId: number) => {
        setFavorites(prev => 
            isFavorite(movieId) 
                ? prev.filter(id => id !== movieId) 
                : [...prev, movieId]
        );
    };

    return { favorites, isFavorite, toggleFavorite };
};