// src/components/common/StyledAlert.jsx
import React from 'react';

const StyledAlert = ({ children, severity }) => (
  <div className={`p-3 sm:p-4 rounded-lg flex items-start gap-2 sm:gap-3 ${
    severity === 'Extreme' ? 'bg-red-50 text-red-800' :
    severity === 'Very High' ? 'bg-orange-50 text-orange-800' :
    severity === 'High' ? 'bg-yellow-50 text-yellow-800' :
    'bg-green-50 text-green-800'
  }`}>
    {children}
  </div>
);

export default StyledAlert;
