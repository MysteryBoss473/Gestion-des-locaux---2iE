'use client';
import { useState } from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = "Rechercher..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
        aria-label="Rechercher"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchBar;