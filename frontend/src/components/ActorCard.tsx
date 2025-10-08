import type { Actor } from '../types';
import { motion } from 'framer-motion';

const ActorCard = ({ actor }: { actor: Actor }) => {
    const placeholderImage = "https://placehold.co/185x278/1f2937/a5b4fc?text=No+Photo";
    return (
        <motion.div whileHover={{ scale: 1.05 }} className="text-center">
            <img 
                src={actor.image_url || placeholderImage} 
                alt={actor.name}
                className="w-full h-auto rounded-lg shadow-md object-cover aspect-[2/3]"
            />
            <p className="mt-2 text-sm font-semibold text-white truncate">{actor.name}</p>
        </motion.div>
    );
};

export default ActorCard;