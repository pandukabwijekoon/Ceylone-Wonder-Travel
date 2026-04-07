import React from 'react';
import { useParams } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

function Destination() {
  const { name } = useParams();
  
  return (
    <div style={{ padding: '8rem 2rem', color: '#fff', textAlign: 'center', background: '#050D10', minHeight: '100vh' }}>
      <h1 style={{ textTransform: 'capitalize', color: '#C9A84C' }}>{name.replace('-', ' ')}</h1>
      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <WeatherWidget locationName={name} />
      </div>
      <p>Component is being migrated from static HTML...</p>
    </div>
  );
}

export default Destination;
