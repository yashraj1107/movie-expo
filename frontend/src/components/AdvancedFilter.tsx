import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaFilter, FaTimes } from 'react-icons/fa';
import type { Director, Actor } from '../types';

interface FilterState { directorId: string; actorId: string; year: string; }
interface AdvancedFilterProps {
    onApplyFilters: (filters: FilterState) => void;
    onClearFilters: () => void;
}

const AdvancedFilter = ({ onApplyFilters, onClearFilters }: AdvancedFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [directors, setDirectors] = useState<Director[]>([]);
    const [actors, setActors] = useState<Actor[]>([]);
    const [localFilters, setLocalFilters] = useState<FilterState>({ directorId: '', actorId: '', year: '' });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (directors.length === 0) axios.get('/api/directors').then(res => setDirectors(res.data));
            if (actors.length === 0) axios.get('/api/actors').then(res => setActors(res.data));
        }
    }, [isOpen, directors.length, actors.length]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleApply = () => { onApplyFilters(localFilters); setIsOpen(false); };
    const handleClear = () => {
        setLocalFilters({ directorId: '', actorId: '', year: '' });
        onClearFilters(); setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                <FaFilter /> Filters
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 z-20">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300">Director</label>
                            <select value={localFilters.directorId} onChange={e => setLocalFilters({...localFilters, directorId: e.target.value})} className="w-full mt-1 bg-gray-700 p-2 rounded-md">
                                <option value="">All Directors</option>
                                {directors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300">Actor</label>
                            <select value={localFilters.actorId} onChange={e => setLocalFilters({...localFilters, actorId: e.target.value})} className="w-full mt-1 bg-gray-700 p-2 rounded-md">
                                <option value="">All Actors</option>
                                {actors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300">Release Year</label>
                            <input type="number" placeholder="e.g., 2021" value={localFilters.year} onChange={e => setLocalFilters({...localFilters, year: e.target.value})} className="w-full mt-1 bg-gray-700 p-2 rounded-md" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                        <button onClick={handleClear} className="w-full flex justify-center items-center gap-2 bg-gray-600 text-white font-semibold py-2 rounded-md hover:bg-gray-500">
                           <FaTimes /> Clear
                        </button>
                        <button onClick={handleApply} className="w-full bg-cyan-500 text-white font-semibold py-2 rounded-md hover:bg-cyan-600">
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdvancedFilter;