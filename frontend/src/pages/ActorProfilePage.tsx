import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { ActorDetail } from '../types'; 

const ActorProfilePage = () => {
    const { actorId } = useParams<{ actorId: string }>();
    const [actor, setActor] = useState<ActorDetail | null>(null);

    useEffect(() => {
        if (actorId) {
            axios.get(`/api/actors/${actorId}`).then(res => setActor(res.data));
        }
    }, [actorId]);

    if (!actor) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img src={actor.image_url || ''} alt={actor.name} className="w-48 h-48 rounded-full object-cover" />
                <div>
                    <h1 className="text-4xl font-bold text-center md:text-left">{actor.name}</h1>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Filmography</h2>
                <div className="space-y-4">
                    {actor.movies.map(movie => (
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
export default ActorProfilePage;