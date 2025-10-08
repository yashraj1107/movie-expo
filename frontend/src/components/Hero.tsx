import Slider from "react-slick";
import { Link } from 'react-router-dom';
import type { Movie } from "../types";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface HeroProps {
    movies: Movie[];
}

const Hero = ({ movies }: HeroProps) => {
    const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1, autoplay: true, arrows: false };
    if (movies.length === 0) return <div className="h-[60vh] -mt-16 w-full animate-pulse bg-gray-800"></div>;

    return (
        <div className="relative h-[60vh] -mt-16">
            <Slider {...settings}>
                {movies.map((movie) => (
                    <div key={movie.id}>
                        <div 
                            className="relative h-[60vh] w-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${movie.backdrop_url})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-16">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                    <h2 className="text-4xl md:text-6xl font-bold text-white max-w-2xl">{movie.title}</h2>
                                    <p className="text-gray-300 max-w-2xl mt-4 line-clamp-3">{movie.synopsis}</p>
                                    <Link to={`/movies/${movie.id}`}>
                                        <button className="mt-6 px-6 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 transition-colors">
                                            Details
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Hero;
