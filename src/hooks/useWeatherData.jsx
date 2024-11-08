import { useState, useEffect } from "react";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export const useWeatherData = (location) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocationCoordinates = async (location) => {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?name=${encodeURIComponent(location)}&count=1`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.results?.length) {
        throw new Error(`Location "${location}" not found`);
      }

      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
        timezone: data.results[0].timezone
      };
    } catch (error) {
      throw new Error(`Failed to get coordinates: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { latitude, longitude, timezone } = await getLocationCoordinates(location);

        const weatherResponse = await fetch(
          `${WEATHER_API_URL}?` + new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            timezone: timezone,
            current_weather: true,
            hourly: [
              'relative_humidity_2m',
              'precipitation_probability',
              'uv_index'
            ].join(','),
            daily: [
              'weather_code',
              'temperature_2m_max',
              'temperature_2m_min',
              'precipitation_sum',
              'precipitation_probability_max',
              'uv_index_max'
            ].join(',')
          })
        );

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();

        // Get current hour index for hourly data
        const currentDate = new Date();
        const currentHourIndex = weatherData.hourly.time.findIndex(
          time => new Date(time).getHours() === currentDate.getHours()
        );

        // Structure current weather data
        const current = {
          temperature: weatherData.current_weather.temperature,
          weather_code: weatherData.current_weather.weathercode,
          wind_speed: weatherData.current_weather.windspeed,
          relative_humidity: weatherData.hourly.relative_humidity_2m[currentHourIndex],
          precipitation_probability: weatherData.hourly.precipitation_probability[currentHourIndex],
          uv_index: weatherData.hourly.uv_index[currentHourIndex]
        };

        // Structure forecast data
        const dailyForecast = weatherData.daily.time.map((date, index) => ({
          date: date,
          weather_code: weatherData.daily.weather_code[index],
          temperature_max: weatherData.daily.temperature_2m_max[index],
          temperature_min: weatherData.daily.temperature_2m_min[index],
          precipitation_sum: weatherData.daily.precipitation_sum[index],
          precipitation_probability: weatherData.daily.precipitation_probability_max[index],
          uv_index_max: weatherData.daily.uv_index_max[index]
        }));

        setCurrentWeather(current);
        setForecast(dailyForecast);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  return { currentWeather, forecast, loading, error };
};