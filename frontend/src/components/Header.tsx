import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${query}`);
        }
    };

    return (
        <header className="bg-transparent absolute top-0 left-0 right-0 z-20">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link to="/"><h1 className="text-2xl font-bold text-white">Movie Expo</h1></Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
                        <Link to="/favorites" className="text-sm text-gray-300 hover:text-white transition-colors">Favorites</Link>
                    </nav>
                </div>
                <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="bg-black/20 text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-40 md:w-64"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </button>
                </form>
            </div>
        </header>
    );
};
export default Header;