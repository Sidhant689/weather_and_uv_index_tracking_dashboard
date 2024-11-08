// src/components/weather/WeatherMetric.jsx
import React from 'react';

const WeatherMetric = ({ icon: Icon, value, unit, label, colorClass }) => (
  <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg">
    <Icon className={`h-8 w-8 ${colorClass}`} />
    <div>
      <div className="text-2xl font-bold">{value}{unit}</div>
      <div className="text-gray-500">{label}</div>
    </div>
  </div>
);

export default WeatherMetric;
