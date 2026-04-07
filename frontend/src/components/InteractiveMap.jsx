import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function InteractiveMap() {
  const [activePin, setActivePin] = useState(null);

  // Exact relative % positions tailored for sl.png (16:9 Landscape Map)
  const pins = [
    { id: 'kandy', name: 'Kandy', top: '48%', left: '50%', desc: 'The Cultural Capital', image: '/assest/dalada maligawa.jpeg' },
    { id: 'colombo', name: 'Colombo', top: '63%', left: '39%', desc: 'The Commercial Hub', image: '/assest/kandy clock tower.jpeg' },
    { id: 'galle', name: 'Galle', top: '86%', left: '45%', desc: 'Historic Fort Coast', image: '/assest/bodigala.jpeg' },
    { id: 'nuwara-eliya', name: 'Nuwara Eliya', top: '65%', left: '52%', desc: 'Little England', image: '/assest/hulangala.jpeg' }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', background: 'rgba(5,13,16,0.6)', borderRadius: '24px', border: '1px solid rgba(201,168,76,0.3)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 4px 4px, #C9A84C 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

      <div style={{ padding: '2rem', textAlign: 'center', zIndex: 10 }}>
        <h3 style={{ fontFamily: "'Cinzel', serif", color: '#C9A84C', margin: 0, fontSize: '2rem' }}>
          Discover <span style={{ color: '#fff' }}>Sri Lanka</span>
        </h3>
      </div>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxWidth: '850px', marginBottom: '2rem' }}>
        
        {/* User's Map Image */}
        <img 
          src="/assest/sl.png" 
          alt="Sri Lanka Map" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }} 
        />

        {/* RENDER HTML PINS OVER IMAGE */}
        {pins.map((pin) => (
          <div 
            key={pin.id} 
            style={{ 
              position: 'absolute', 
              top: pin.top, 
              left: pin.left, 
              transform: 'translate(-50%, -50%)',
              zIndex: activePin === pin.id ? 50 : 10
            }}
          >
            {/* The Dot Marker */}
            <div 
              onMouseEnter={() => setActivePin(pin.id)}
              onMouseLeave={() => setActivePin(null)}
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 20 }}
            >
              <div style={{ 
                width: activePin === pin.id ? '20px' : '16px', 
                height: activePin === pin.id ? '20px' : '16px', 
                background: activePin === pin.id ? '#1ABC9C' : '#C9A84C', 
                borderRadius: '50%', 
                boxShadow: `0 0 20px ${activePin === pin.id ? '#1ABC9C' : '#C9A84C'}`, 
                border: '3px solid #050D10',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
              }}></div>
              
              {/* Permanent Label below pin */}
              <div style={{ 
                fontSize: '0.85rem', 
                marginTop: '0.5rem', 
                color: activePin === pin.id ? '#1ABC9C' : '#fff', 
                fontWeight: 600, 
                background: 'rgba(5,13,16,0.8)', 
                padding: '2px 8px', 
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}>{pin.name}</div>
            </div>

            {/* Hover Content Card */}
            <div style={{ 
              position: 'absolute', 
              bottom: '100%', 
              left: '50%', 
              transform: `translate(-50%, calc(-10px - ${activePin === pin.id ? '10px' : '0px'}))`, 
              width: '220px', 
              background: '#050D10', 
              border: '1px solid rgba(26,188,156,0.4)', 
              borderRadius: '16px', 
              padding: '1rem', 
              boxShadow: '0 15px 40px rgba(0,0,0,0.8)', 
              opacity: activePin === pin.id ? 1 : 0,
              pointerEvents: activePin === pin.id ? 'all' : 'none',
              visibility: activePin === pin.id ? 'visible' : 'hidden',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              zIndex: 10
            }}>
              <div style={{ position: 'relative', width: '100%', height: '110px', marginBottom: '0.8rem', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={pin.image} alt={pin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.2rem', color: '#1ABC9C', fontFamily: "'Cinzel', serif" }}>{pin.name}</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#8BA8AE', lineHeight: 1.4 }}>{pin.desc}</p>
              <Link to={`/destination/${pin.id}`} className="btn btn-outline" style={{ padding: '0.4rem 0', width: '100%', fontSize: '0.8rem', justifyContent: 'center', borderColor: '#1ABC9C', color: '#1ABC9C' }}>
                <i className="fas fa-compass"></i> Explore
              </Link>
              
              {/* Arrow Pointer */}
              <div style={{ position: 'absolute', bottom: '-7px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '14px', height: '14px', background: '#050D10', borderRight: '1px solid rgba(26,188,156,0.4)', borderBottom: '1px solid rgba(26,188,156,0.4)' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InteractiveMap;
