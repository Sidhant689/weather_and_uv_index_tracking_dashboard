export const getUVAlert = (uvIndex) => {
  let severity = "";
  let message = "";

  if (uvIndex <= 2) {
    severity = "Low";
    message = "Low risk of harm from unprotected sun exposure.";
  } else if (uvIndex <= 5) {
    severity = "Moderate";
    message = "Moderate risk of harm from unprotected sun exposure.";
  } else if (uvIndex <= 7) {
    severity = "High";
    message = "High risk of harm from unprotected sun exposure.";
  } else if (uvIndex <= 10) {
    severity = "Very High";
    message = "Very high risk of harm from unprotected sun exposure.";
  } else {
    severity = "Extreme";
    message = "Extreme risk of harm from unprotected sun exposure.";
  }

  return { severity, message };
};
