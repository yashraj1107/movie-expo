import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { DirectorDetail } from '../types'; 

const DirectorProfilePage = () => {
    const { directorId } = useParams<{ directorId: string }>();
    const [director, setDirector] = useState<DirectorDetail | null>(null);

    useEffect(() => {
        if (directorId) {
            axios.get(`/api/directors/${directorId}`).then(res => setDirector(res.data));
        }
    }, [directorId]);

    if (!director) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold">{director.name}</h1>
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Filmography</h2>
                <div className="space-y-4">
                    {director.movies.map(movie => (
                        <Link to={`/movies/${movie.id}`} key={movie.id} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700">
                           <p className="font-bold text-lg">{movie.title}</p>
                           <p className="text-sm text-gray-400">{movie.release_year}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default DirectorProfilePage;