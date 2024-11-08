// src/components/weather/UVAlert.jsx
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import StyledAlert from '../common/StyleAlert';
import { getUVAlert } from '../../utils/uvUtils';

const UVAlert = ({ uvIndex }) => {
  const uvAlert = getUVAlert(uvIndex);
  
  return (
    <StyledAlert severity={uvAlert.severity}>
      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
      <div>
        <div className="text-sm sm:text-base font-bold">UV Index: {uvIndex} - {uvAlert.severity}</div>
        <div className="text-xs sm:text-sm">{uvAlert.message}</div>
      </div>
    </StyledAlert>
  );
};

export default UVAlert;
