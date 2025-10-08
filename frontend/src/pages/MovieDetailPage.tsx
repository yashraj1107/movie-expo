import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { Movie } from '../types';
import ActorCard from '../components/ActorCard';
import { motion } from 'framer-motion';

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        if (movieId) {
            axios.get(`/api/movies/${movieId}`).then(res => setMovie(res.data));
        }
    }, [movieId]);

    if (!movie) return <div className="text-center p-10">Loading...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${movie.backdrop_url})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
            <div className="container mx-auto px-4 pb-16 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <motion.div initial={{ y: 50, opacity: 0}} animate={{ y: 0, opacity: 1}} transition={{ delay: 0.2 }}>
                       <img src={movie.poster_url || ''} alt={movie.title} className="w-64 rounded-lg shadow-xl mx-auto" />
                    </motion.div>
                    <div className="flex-1 pt-8 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white">{movie.title} ({movie.release_year})</h1>
                        <div className="mt-2 flex items-center justify-center md:justify-start gap-4 text-gray-400">
                            <span>{movie.runtime_minutes} min</span>
                            {movie.director && <>
                                <span>&bull;</span>
                                <Link to={`/directors/${movie.director.id}`} className="hover:text-cyan-400">
                                    Directed by {movie.director.name}
                                </Link>
                            </>}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            {movie.genres.map(g => <span key={g.id} className="bg-gray-700 text-xs px-3 py-1 rounded-full">{g.name}</span>)}
                        </div>
                        <p className="mt-6 text-gray-300">{movie.synopsis}</p>
                    </div>
                </div>
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-white mb-6">Cast</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {movie.actors.map(actor => (
                            <Link to={`/actors/${actor.id}`} key={actor.id}>
                                <ActorCard actor={actor} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default MovieDetailPage;