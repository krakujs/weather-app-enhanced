import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";
import { useTemperature } from './TemperatureContext';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const { isCelsius, setIsCelsius } = useTemperature();

  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(storedSearches);
  }, []);

  const fetchData = async (city) => {
    setIsLoading(true);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setCityName("");
      setError(null);
      
      const updatedSearches = [city, ...recentSearches.filter(search => search !== city)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(cityName);
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name..."
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {weatherData && (
        <div>
          <h2>
            {weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}
          </h2>
          <p>
            Temperature: {isCelsius ? weatherData.current.temp_c + " °C" : weatherData.current.temp_f + " °F"}
          </p>
          <button onClick={toggleTemperatureUnit}>
            Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
          </button>
          <p>Condition: {weatherData.current.condition.text}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <p>Humidity: {weatherData.current.humidity} %</p>
          <p>Pressure: {weatherData.current.pressure_mb} mb</p>
          <p>Visibility: {weatherData.current.vis_km} km</p>
        </div>
      )}
      <div>
        <h3>Recent Searches</h3>
        <ul>
          {recentSearches.map((city, index) => (
            <li key={index} onClick={() => fetchData(city)}>{city}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;