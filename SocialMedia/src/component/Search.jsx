import React, { useState, useRef, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';

function useSearch(initialItems = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const blurTimeout = useRef(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const filteredItems = useMemo(() => {
    return initialItems
      .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 4);
  }, [searchTerm, initialItems]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
    setHighlightIndex(-1);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  const handleFocus = () => {
    clearTimeout(blurTimeout.current);
    if (searchTerm) setShowDropdown(true);
  };

  return {
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    filteredItems,
    handleInputChange,
    handleBlur,
    handleFocus,
    highlightIndex,
    setHighlightIndex
  };
}

function Search({ items = [], onSearch }) {
  const {
    searchTerm,
    setSearchTerm,
    showDropdown,
    setShowDropdown,
    filteredItems,
    handleInputChange,
    handleBlur,
    handleFocus,
    highlightIndex,
    setHighlightIndex
  } = useSearch(items);

  const triggerSearch = (term) => {
    onSearch && onSearch(term);
    setShowDropdown(false);
    setSearchTerm(term)
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' && showDropdown) {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp' && showDropdown) {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0) {
        triggerSearch(filteredItems[highlightIndex]);
      } else {
        triggerSearch(searchTerm);
      }
    }
  };

  return (
    <div
      onBlur={handleBlur}
      onFocus={handleFocus}
      className="relative w-full"
    >
      <div className="flex w-full bg-gray-200 p-2 rounded-lg">
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={() => triggerSearch(searchTerm)}
          aria-label="Search"
          className="p-2 hover:cursor-pointer bg-gray-400"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>

      {showDropdown && filteredItems.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto text-sm">
          {filteredItems.map((item, index) => (
            <li
              key={item}
              onMouseDown={() => triggerSearch(item)}
              onMouseEnter={() => setHighlightIndex(index)}
              className={`px-3 py-2 cursor-pointer ${highlightIndex === index ? 'bg-gray-400' : ''}`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;