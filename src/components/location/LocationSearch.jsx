import React, { useState } from 'react';

const LocationSearch = ({ onLocationChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLocationChange(searchTerm); // Pass the search term as the new location
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Enter location"
        className="p-2 border rounded w-full"
      />
      <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Search</button>
    </form>
  );
};

export default LocationSearch;
