import { useState, useEffect } from "react";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export const useWeatherData = (location = null) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(location);

  // Get user's current location coordinates
  useEffect(() => {
    if (!location) {
      setLoading(true);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `${GEOCODING_API_URL}?latitude=${latitude}&longitude=${longitude}&count=1`
              );
              const data = await response.json();
              if (data.results?.length > 0) {
                setCurrentLocation(data.results[0].name);
              } else {
                setCurrentLocation("Bangalore"); // Fallback location
              }
            } catch (error) {
              console.error("Error getting location name:", error);
              setCurrentLocation("Bangalore"); // Fallback location
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setCurrentLocation("Bangalore"); // Fallback location
          }
        );
      } else {
        setCurrentLocation("Bangalore"); // Fallback location
      }
    }
  }, [location]);

  const getLocationCoordinates = async (loc) => {
    try {
      const response = await fetch(
        `${GEOCODING_API_URL}?name=${encodeURIComponent(loc)}&count=1`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.results?.length) {
        throw new Error(`Location "${loc}" not found`);
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
      if (!currentLocation) return;
      
      try {
        setLoading(true);
        setError(null);

        const { latitude, longitude, timezone } = await getLocationCoordinates(currentLocation);

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

    fetchWeatherData();
  }, [currentLocation]);

  return { 
    currentWeather, 
    forecast, 
    loading, 
    error,
    currentLocation // Added to return value
  };
};