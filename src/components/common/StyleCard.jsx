// src/components/common/StyledCard.jsx
import React from 'react';

const StyledCard = ({ children, className = '' }) => {
  return (
  <div className={`bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 ${className}`}>
    {children}
  </div>
  );
};

export default StyledCard;
