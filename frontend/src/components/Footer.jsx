import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon">🌿</div>
              <div className="logo-text"><span>Ceylon Wonders</span><span>Sri Lanka Travel</span></div>
            </div>
            <p>Your premier gateway to discovering the magical island of Sri Lanka. We craft unforgettable travel experiences.</p>
            <div className="footer-social">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Destinations</h5>
            <ul>
              <li><Link to="/destination/kandy">Kandy</Link></li>
              <li><Link to="/destination/colombo">Colombo</Link></li>
              <li><Link to="/destination/galle">Galle</Link></li>
              <li><Link to="/destination/nuwara-eliya">Nuwara Eliya</Link></li>
              <li><Link to="/explore">All Places</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><Link to="/booking">Hotel Booking</Link></li>
              <li><a href="#">Tour Packages</a></li>
              <li><a href="#">Airport Transfer</a></li>
              <li><a href="#">Travel Insurance</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+94112345678"><i className="fas fa-phone" style={{ marginRight: '0.5rem', color: '#C9A84C' }}></i>+94 81 7321165</a></li>
              <li><a href="mailto:info@ceylonwonders.lk"><i className="fas fa-envelope" style={{ marginRight: '0.5rem', color: '#C9A84C' }}></i>info@ceylonwonders.lk</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ceylon Wonders. All rights reserved.</span>
          <span>❤️ for Sri Lanka</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
