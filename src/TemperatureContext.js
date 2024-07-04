import React, { createContext, useState, useContext, useEffect } from 'react';

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [isCelsius, setIsCelsius] = useState(() => {
    const stored = localStorage.getItem('temperatureUnit');
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem('temperatureUnit', JSON.stringify(isCelsius));
  }, [isCelsius]);

  return (
    <TemperatureContext.Provider value={{ isCelsius, setIsCelsius }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = () => useContext(TemperatureContext);