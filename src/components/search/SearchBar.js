'use client';

import { useState, useEffect, useRef } from 'react';

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef(null);

  // Handle input change with debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search
    searchTimeout.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  // Clear search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative rounded-md transition ${
        isFocused ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className={`h-5 w-5 transition ${
            isFocused ? 'text-primary' : 'text-gray-400'
          }`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-dark-light rounded-md border border-gray-700 focus:outline-none text-white placeholder-gray-400"
      />
      
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;