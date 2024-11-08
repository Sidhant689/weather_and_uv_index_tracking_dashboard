// src/components/buttons/AQIButton.jsx
import React from 'react';
import { ExternalLink } from 'lucide-react';

const AQIButton = () => (
  <a
  href={import.meta.env.VITE_AQI_URL}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors"
  >
    <span>Check Air Quality</span>
    <ExternalLink className="h-4 w-4" />
  </a>
);

export default AQIButton;

