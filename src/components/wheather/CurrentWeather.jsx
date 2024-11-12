// src/components/weather/CurrentWeather.jsx
import React from 'react';
import { Sun, Umbrella, Wind, Droplets, ThermometerSun } from 'lucide-react';
import StyledCard from '../common/StyleCard';
import AQIButton from '../buttons/AQIButton';
import WeatherMetric from './WeatherMetric';
import { getWeatherDescription } from '../../utils/getWeatherDescription';

const CurrentWeather = ({ currentWeather, rainChance, locationName, weatherCode }) => {
  const weatherDescription = getWeatherDescription(currentWeather.weather_code);
debugger
  return (
    <StyledCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{locationName}</div> {/* Display location name */}
          <div className="text-sm text-gray-500">{weatherDescription}</div> {/* Display weather description */}
        </div>
        <AQIButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <WeatherMetric
          icon={Sun}
          value={currentWeather.temperature}
          unit="°C"
          label="Temperature"
          colorClass="text-yellow-500"
        />
        <WeatherMetric
          icon={Droplets}
          value={currentWeather.relative_humidity}
          unit="%"
          label="Humidity"
          colorClass="text-blue-500"
        />
        <WeatherMetric
          icon={Wind}
          value={currentWeather.wind_speed}
          unit=" km/h"
          label="Wind Speed"
          colorClass="text-gray-500"
        />
        <WeatherMetric
          icon={Umbrella}
          value={rainChance}
          unit="%"
          label="Rain Chance"
          colorClass="text-purple-500"
        />
      </div>
    </StyledCard>
  );
};

export default CurrentWeather;
