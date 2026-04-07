import React, { useState, useEffect } from 'react';

function WeatherWidget({ locationName }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Simulate fetching weather based on location
    const fetchWeather = () => {
      let temp = 28;
      let condition = 'Sunny';
      let icon = 'fa-sun';
      
      const lowerLoc = locationName.toLowerCase();
      if (lowerLoc.includes('nuwara')) {
        temp = 16; condition = 'Misty'; icon = 'fa-cloud-meatball'; // mock cloud 
      } else if (lowerLoc.includes('galle')) {
        temp = 30; condition = 'Clear'; icon = 'fa-sun';
      } else if (lowerLoc.includes('colombo')) {
        temp = 31; condition = 'Partly Cloudy'; icon = 'fa-cloud-sun';
      }

      setWeather({ temp, condition, icon });
    };

    fetchWeather();
  }, [locationName]);

  if (!weather) return null;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(5, 13, 16, 0.6)', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(10px)' }}>
      <i className={`fas ${weather.icon}`} style={{ color: '#F39C12', fontSize: '1.2rem' }}></i>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{weather.temp}°C</span>
        <span style={{ color: '#8BA8AE', fontSize: '0.7rem', textTransform: 'uppercase' }}>{weather.condition}</span>
      </div>
    </div>
  );
}

export default WeatherWidget;
