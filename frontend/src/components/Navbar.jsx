import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change and verify auth status
  useEffect(() => {
    setMenuOpen(false);
    
    // Check if a user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  return (
    <>
      <header id="mainHeader" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container">
          <Link to="/" className="logo">
            <div className="logo-icon">🌿</div>
            <div className="logo-text">
              <span>Ceylon Wonders</span>
              <span>Sri Lanka Travel</span>
            </div>
          </Link>
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li className="nav-dropdown">
              <Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>
                Destinations <i className="fas fa-chevron-down" style={{ fontSize: '0.7rem' }}></i>
              </Link>
              <ul className="dropdown-menu">
                <li><Link to="/destination/kandy"><span className="place-emoji">🏛️</span> Kandy</Link></li>
                <li><Link to="/destination/colombo"><span className="place-emoji">🌆</span> Colombo</Link></li>
                <li><Link to="/destination/galle"><span className="place-emoji">🏰</span> Galle</Link></li>
                <li><Link to="/destination/nuwara-eliya"><span className="place-emoji">🍃</span> Nuwara Eliya</Link></li>
                <li><Link to="/explore"><span className="place-emoji">🗺️</span> All Places</Link></li>
              </ul>
            </li>
            {(!user || user.isLocal === false) && (
              <li><Link to="/packages" className={location.pathname === '/packages' ? 'active' : ''} style={{ color: '#C9A84C', fontWeight: '700' }}>Tour Packages</Link></li>
            )}
            <li><Link to="/booking" className={location.pathname === '/booking' ? 'active' : ''}>Book Hotels</Link></li>

          </ul>
          <div className="nav-actions">
            {!user ? (
              <Link to="/login" className="nav-btn-login">Sign In</Link>
            ) : (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="nav-btn-login" style={{ borderColor: '#1ABC9C', color: '#1ABC9C' }}>
                    <i className="fas fa-crown"></i> Admin
                  </Link>
                )}
                <Link to="/dashboard" className="nav-btn-login" style={{ border: 'none', background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}>
                  <i className="fas fa-user-circle"></i> Welcome, {user.name ? user.name.split(' ')[0] : 'User'}
                </Link>
              </>
            )}
            <Link to="/booking" className="nav-btn-book">Book Now ✈️</Link>
            <div 
              className={`hamburger ${menuOpen ? 'active' : ''}`} 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/">🏠 Home</Link>
        <Link to="/destination/kandy">🏛️ Kandy</Link>
        <Link to="/destination/colombo">🌆 Colombo</Link>
        <Link to="/destination/galle">🏰 Galle</Link>
        <Link to="/destination/nuwara-eliya">🍃 Nuwara Eliya</Link>
        <Link to="/explore">🗺️ All Destinations</Link>
        <Link to="/booking">🏨 Book Hotels</Link>
        <div className="mobile-menu-actions">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</Link>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <Link to="/dashboard" className="btn btn-primary" style={{ justifyContent: 'center' }}><i className="fas fa-user-circle"></i> Welcome, {user.name ? user.name.split(' ')[0] : 'User'}</Link>
              {user.isAdmin && (
                <Link to="/admin" className="btn btn-outline" style={{ justifyContent: 'center', borderColor: '#1ABC9C', color: '#1ABC9C' }}><i className="fas fa-crown"></i> Admin</Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
