import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import '../css/auth.css';

function Login() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(p => (p + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if(res.ok) {
        // Just store dummy token or user info for now
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.error || 'Failed to login');
      }
    } catch(err) {
      setError('Server Error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link to="/" className="auth-logo">
          <div className="logo-icon">🌿</div>
          <div className="logo-text"><span>Ceylon Wonders</span><span>Sri Lanka Travel</span></div>
        </Link>
        <div className="auth-visual-bg">
          <div className={`slide ${activeSlide === 0 ? 'active' : ''}`}><img src="/assest/sridalada maligawa.jpeg" alt="Kandy" /></div>
          <div className={`slide ${activeSlide === 1 ? 'active' : ''}`}><img src="/assest/kandy clock tower.jpeg" alt="Colombo" /></div>
          <div className={`slide ${activeSlide === 2 ? 'active' : ''}`}><img src="/assest/Queens hotel.jpeg" alt="Queens" /></div>
        </div>
        <div className="auth-visual-overlay"></div>
        <div className="auth-visual-content">
          <div className="auth-visual-quote">"To travel is to <span>live</span>."</div>
          <div className="auth-visual-sub">Welcome back! Pick up right where you left off.</div>
          <div className="visual-dots">
            {[0, 1, 2].map(idx => (
              <button key={idx} className={`vdot ${activeSlide === idx ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}></button>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <p style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Welcome Back</p>
          <h1>Sign <span>In</span></h1>
          <p className="subtitle">Enter your details to access your account</p>

          {error && <div style={{ color: '#FF6B6B', margin: '0 0 1rem 0' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#8BA8AE' }}></i>
                <input type="email" id="email" className="form-control" placeholder="your@email.com" style={{ paddingLeft: '2.5rem' }} onChange={handleChange} required />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Password * <a href="#" style={{ fontSize: '0.75rem', color: '#C9A84C', textDecoration: 'none' }}>Forgot Password?</a>
              </label>
              <div className="pass-wrap">
                <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#8BA8AE', zIndex: 2 }}></i>
                <input type={showPass ? "text" : "password"} id="password" className="form-control" placeholder="••••••••" style={{ paddingLeft: '2.5rem' }} onChange={handleChange} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  <i className={`fas fa-eye${showPass ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.98rem', padding: '0.95rem' }}>
              <i className="fas fa-sign-in-alt"></i> Sign In
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Create One</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
