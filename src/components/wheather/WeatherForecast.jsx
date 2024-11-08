import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  CloudFog,
  Thermometer,
  Droplets,
  UmbrellaIcon
} from 'lucide-react';

import { getWeatherDescription } from '../../utils/getWeatherDescription';

const getWeatherIcon = (code) => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0) return <Sun className="text-yellow-500" />; // Clear sky
  if (code === 1) return <Sun className="text-yellow-500" />; // Mainly clear
  if (code === 2) return <Cloud className="text-gray-400" />; // Partly cloudy
  if (code === 3) return <Cloud className="text-gray-500" />; // Overcast
  if (code === 45 || code === 48) return <CloudFog className="text-gray-400" />; // Foggy
  if (code === 51 || code === 53 || code === 55) return <CloudDrizzle className="text-blue-400" />; // Drizzle
  if (code === 61 || code === 63 || code === 65) return <CloudRain className="text-blue-500" />; // Rain
  if (code === 71 || code === 73 || code === 75) return <CloudSnow className="text-blue-200" />; // Snow
  if (code === 77) return <CloudSnow className="text-blue-200" />; // Snow grains
  if (code === 80 || code === 81 || code === 82) return <CloudRain className="text-blue-600" />; // Rain showers
  if (code === 85 || code === 86) return <CloudSnow className="text-blue-300" />; // Snow showers
  if (code === 95) return <CloudLightning className="text-yellow-400" />; // Thunderstorm
  if (code === 96 || code === 99) return <CloudLightning className="text-yellow-500" />; // Thunderstorm with hail
  return <Cloud className="text-gray-400" />; // Default
};

const getUVIndexColor = (uvIndex) => {
  if (uvIndex <= 2) return 'text-green-500';
  if (uvIndex <= 5) return 'text-yellow-500';
  if (uvIndex <= 7) return 'text-orange-500';
  if (uvIndex <= 10) return 'text-red-500';
  return 'text-purple-500';
};

const WeatherForecast = ({ forecast }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {forecast.map((day, index) => (
      <div 
        key={index} 
        className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
      >
        {/* Date */}
        <div className="text-lg font-semibold mb-2 text-gray-700">
          {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>

        {/* Weather Icon and Description */}
        <div className="flex flex-col items-center gap-2 mb-3">
          <div className="flex items-center justify-center">
            {getWeatherIcon(day.weather_code)}
          </div>
          <div className="text-sm text-gray-600 text-center">
            {getWeatherDescription(day.weather_code)}
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-1 mb-2">
          <Thermometer className="h-4 w-4 text-red-500" />
          <span className="font-medium">
            <span className="text-red-500">{Math.round(day.temperature_max)}°</span>
            <span className="text-gray-400 mx-1">/</span>
            <span className="text-blue-500">{Math.round(day.temperature_min)}°</span>
          </span>
        </div>

        {/* Precipitation */}
        <div className="flex items-center gap-1 mb-1">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">{day.precipitation_sum}mm</span>
        </div>

        {/* Precipitation Probability */}
        {day.precipitation_probability && (
          <div className="flex items-center gap-1 mb-1">
            <UmbrellaIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{day.precipitation_probability}%</span>
          </div>
        )}

        {/* UV Index */}
        {day.uv_index_max && (
          <div className="flex items-center gap-1">
            <Sun className={`h-4 w-4 ${getUVIndexColor(day.uv_index_max)}`} />
            <span className={`text-sm ${getUVIndexColor(day.uv_index_max)}`}>
              UV {Math.round(day.uv_index_max)}
            </span>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default WeatherForecast;