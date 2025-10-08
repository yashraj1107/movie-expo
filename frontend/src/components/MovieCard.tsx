import { Link } from 'react-router-dom';
import type { Movie } from '../types';
import { FaStar, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';

const MovieCard = ({ movie }: { movie: Movie }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const placeholderImage = "https://placehold.co/500x750/1f2937/a5b4fc?text=No+Image";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="block"
        >
            <div className="relative">
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(movie.id); }}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/50 rounded-full text-white hover:text-red-500"
                >
                    <FaHeart className={isFavorite(movie.id) ? 'text-red-500' : 'text-white/70'} />
                </button>
                <Link to={`/movies/${movie.id}`}>
                    <div className="overflow-hidden rounded-xl bg-gray-800 shadow-lg">
                        <div className="relative">
                            <img 
                                src={movie.poster_url || placeholderImage} 
                                alt={`Poster for ${movie.title}`} 
                                className="w-full h-auto object-cover aspect-[2/3]"
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="text-md font-bold text-white truncate" title={movie.title}>
                                {movie.title}
                            </h3>
                            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                <span>{movie.release_year}</span>
                                <span className="flex items-center gap-1">
                                    <FaStar className="text-yellow-400" />
                                    {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};
export default MovieCard;
