import React, { useState, useCallback } from 'react';
import Search from './component/Search';

const items = ['apple', 'banana', 'cherry', 'date', 'elderberry'];

function Test() {
  const [filteredData, setFilteredData] = useState(items);

  const handleSearch = useCallback((term) => {
    const results = items.filter(item =>
      item.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(results);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-5 p-4 bg-white rounded-lg shadow">
      <Search items={items} onSearch={handleSearch} />
      <ul className="mt-4 space-y-2 w-full">
        {filteredData.map(item => (
          <li
            key={item}
            className="w-full bg-gray-100 py-2 px-4 rounded-lg text-center"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Test;