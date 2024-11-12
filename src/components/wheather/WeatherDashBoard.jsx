import React, { useState, useEffect } from "react";
import CurrentWeather from "./CurrentWeather";
import WeatherForecast from "./WeatherForecast";
import UVAlert from "./UVAlert";
import LocationSearch from "../location/LocationSearch";
import { useWeatherData } from "../../hooks/useWeatherData";

// Updated to use the correct reverse geocoding endpoint
const GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json";
const GEOCODING_API_KEY = "d65a24d6ed2c429582081fdd38b816be"; // You'll need to get an API key from OpenCage

const WeatherDashboard = () => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const { currentWeather, forecast, loading, error } = useWeatherData(location, coordinates);

  // Updated function to get city name from coordinates using OpenCage API
  const getCityFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?q=${latitude}+${longitude}&key=${GEOCODING_API_KEY}&language=en&pretty=1`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Get city and state from components
        const components = data.results[0].components;
        const city = components.city || components.town || components.village || components.suburb;
        setLocation(city || "Unknown Location");
      } else {
        setLocation("Unknown Location");
      }
    } catch (error) {
      console.error("Error getting city name:", error);
      setLocation("Unknown Location");
    }
  };

  // Get user's current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          await getCityFromCoordinates(latitude, longitude);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Bangalore"); // Fallback to default city
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocation("Bangalore"); // Fallback to default city
      setIsLoadingLocation(false);
    }
  }, []);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setCoordinates(null); // Clear coordinates when manually searching
  };

  if (isLoadingLocation) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LocationSearch onLocationChange={handleLocationChange} />
      {loading ? (
        <div className="text-center py-8">
          <p>Loading weather data...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">
          {error}
        </div>
      ) : (
        <>
          <CurrentWeather
            currentWeather={currentWeather}
            rainChance={forecast?.daily?.precipitation_probability_max[0]}
            locationName={location}
            weatherCode={currentWeather?.weathercode}
          />
          <div className="mt-8">
            <UVAlert uvIndex={currentWeather?.uv_index} />
          </div>
          <div className="mt-8">
            <WeatherForecast forecast={forecast} />
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;