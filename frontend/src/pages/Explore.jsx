import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import '../css/explore.css';

const destinations = [
  { id: 'kandy', name: 'Kandy', type: 'Cultural Capital', image: '/assest/dalada maligawa.jpeg', category: 'Cultural', tag: 'Popular' },
  { id: 'colombo', name: 'Colombo', type: 'Commercial Hub', image: '/assest/kandy clock tower.jpeg', category: 'City Life' },
  { id: 'galle', name: 'Galle', type: 'Historic Fort', image: '/assest/bodigala.jpeg', category: 'Cultural', tag: 'UNESCO' },
  { id: 'nuwara-eliya', name: 'Nuwara Eliya', type: 'High Tea Country', image: '/assest/hulangala.jpeg', category: 'Highland' },
  { id: 'ambuluwawa', name: 'Ambuluwawa', type: 'Architectural Wonder', image: '/assest/ambuliuwawa.jpeg', category: 'Adventure' },
  { id: 'mahamevnawa', name: 'Mahamevnawa', type: 'Spiritual Retreat', image: '/assest/mahameunava.jpeg', category: 'Cultural' },
  { id: 'ranwan', name: 'Ranwan', type: 'Golden Landscapes', image: '/assest/ranwan.jpeg', category: 'Nature' },
  { id: 'sandagirisaya', name: 'Sanda Giri Saya', type: 'Ancient Relics', image: '/assest/sadagirisaya.jpeg', category: 'Cultural' }
];

function Explore() {
  const [filter, setFilter] = useState('All Places');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Reveal Logic (from animations.css)
    const revealElements = () => {
      const reveals = document.querySelectorAll('.reveal');
      const windowHeight = window.innerHeight;
      reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', revealElements);
    // Trigger once on mount/filter change
    revealElements();
    setTimeout(revealElements, 100);

    return () => window.removeEventListener('scroll', revealElements);
  }, [filter, search]);

  const filteredDestinations = destinations.filter(dest => {
    const matchFilter = filter === 'All Places' || dest.category === filter || (filter === 'Cultural' && dest.tag === 'UNESCO');
    const matchSearch = dest.name.toLowerCase().includes(search.toLowerCase()) || dest.type.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="explore-page">
      {/* HERO */}
      <div className="explore-hero">
        <div className="explore-hero-bg"></div>
        <div className="explore-hero-overlay"></div>
        <div className="explore-hero-content">
          <div className="badge">🗺️ Explore Sri Lanka</div>
          <h1 className="section-title" style={{ color: 'white', WebkitTextFillColor: 'white' }}>A World of Wonder</h1>
          <p>Discover the diverse beauty of our island paradise.</p>
        </div>
      </div>

      {/* MAP SECTION */}
      <section style={{ padding: '4rem 0 1rem', background: '#050D10' }}>
        <div className="container">
          <div className="reveal visible" style={{ marginBottom: '1rem' }}>
            <InteractiveMap />
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="filter-section">
        <div className="container">
          <div className="filter-container">
            {['All Places', 'Cultural', 'Nature', 'Beach', 'Adventure', 'Highland'].map(f => (
            <button 
              key={f} 
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="search-wrap">
            <i className="fas fa-search search-icon"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by place name (e.g. Kandy, Ella...)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="dest-grid">
            {filteredDestinations.map((dest, i) => (
              <Link to={`/destination/${dest.id}`} key={dest.id} className={`dest-card reveal delay-${(i % 3) * 100}`}>
                <img src={dest.image} alt={dest.name} />
                <div className="dest-overlay">
                  <div className="dest-info">
                    <p>{dest.type}</p>
                    <h3>{dest.name}</h3>
                  </div>
                </div>
                {dest.tag && <div className="dest-tag">{dest.tag}</div>}
              </Link>
            ))}
            
            {filteredDestinations.length === 0 && (
              <div style={{ color: '#8BA8AE', gridColumn: '1/-1', textAlign: 'center', padding: '3rem 0' }}>
                No destinations perfectly matching your search. Try adjusting the keywords.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Explore;
