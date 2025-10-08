import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Genre } from '../types';
import { FaFire } from 'react-icons/fa';

interface FilterBarProps {
  onGenreChange: (genreId: string) => void;
  selectedGenreId: string;
}

const FilterBar = ({ onGenreChange, selectedGenreId }: FilterBarProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    axios.get('/api/genres').then(response => setGenres(response.data));
  }, []);
  
  const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 backdrop-blur-sm border border-white/10 shadow-md whitespace-nowrap";
  const activeClasses = "bg-cyan-500 text-white";
  const inactiveClasses = "bg-white/5 text-gray-300 hover:bg-white/20";

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar">
      <button 
        onClick={() => onGenreChange('')}
        className={`${baseClasses} ${selectedGenreId === '' ? activeClasses : inactiveClasses}`}
      >
        <FaFire />
        All
      </button>

      {genres.map(genre => (
        <button 
          key={genre.id}
          onClick={() => onGenreChange(genre.id.toString())}
          className={`${baseClasses} ${selectedGenreId === genre.id.toString() ? activeClasses : inactiveClasses}`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
