import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { debounce } from 'lodash';

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const LocationSearch = ({ onLocationChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced function to fetch location suggestions
  const fetchSuggestions = debounce(async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      const formattedSuggestions = data.results?.map(result => ({
        name: result.name,
        country: result.country,
        admin1: result.admin1, // State/Province
        latitude: result.latitude,
        longitude: result.longitude
      })) || [];

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    const locationName = suggestion.name;
    setSearchTerm(locationName);
    setShowSuggestions(false);
    onLocationChange(locationName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onLocationChange(searchTerm);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative flex">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search for a city..."
            className="w-full p-2 pr-8 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-300"
            onFocus={() => setShowSuggestions(true)}
          />
          {loading && (
            <div className="absolute right-2 top-2">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.name}-${index}`}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="text-sm font-medium">{suggestion.name}</div>
              <div className="text-xs text-gray-500">
                {[suggestion.admin1, suggestion.country].filter(Boolean).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;