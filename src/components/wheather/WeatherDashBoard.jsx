// src/components/WeatherDashboard.jsx
import React, { useState } from "react";
import CurrentWeather from "./CurrentWeather";
import WeatherForecast from "./WeatherForecast";
import UVAlert from "./UVAlert";
import LocationSearch from "../location/LocationSearch";
import { useWeatherData } from "../../hooks/useWeatherData";

const WeatherDashboard = () => {
  const [location, setLocation] = useState("New York");
  const { currentWeather, forecast, uvIndex, loading } = useWeatherData(location);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-2 sm:space-y-4 p-2 sm:p-4">
      <LocationSearch onLocationChange={handleLocationChange} />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <CurrentWeather
            currentWeather={currentWeather}
            rainChance={currentWeather.precipitation_probability}
            locationName={location}
            weatherCode={currentWeather?.weather_code}
          />
          <UVAlert uvIndex={currentWeather.uv_index} />
          <WeatherForecast forecast={forecast} /> {/* Add WeatherForecast component */}
        </>
      )}
    </div>
  );
};

export default WeatherDashboard;
