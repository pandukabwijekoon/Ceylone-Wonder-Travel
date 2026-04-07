import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import '../css/auth.css';

function Signup() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', confirm: '', isLocal: true });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState(1);
  const [otp, setOtp] = useState('');
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

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if(res.ok) {
        setPhase(2);
      } else {
        setError(data.error || 'Failed to send verification code');
      }
    } catch(err) {
      setError('Server Error');
    }
  };

  const verifyOtpAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          username: formData.username, 
          email: formData.email, 
          password: formData.password,
          otp: otp,
          isLocal: formData.isLocal
        })
      });
      const data = await res.json();
      if(res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch(err) {
      setError('Server Error');
    }
  };

  const strength = getStrength(formData.password);
  const colors = ['#FF6B6B', '#F39C12', '#F1C40F', '#1ABC9C'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Link to="/" className="auth-logo">
          <div className="logo-icon">🌿</div>
          <div className="logo-text"><span>Ceylon Wonders</span><span>Sri Lanka Travel</span></div>
        </Link>
        <div className="auth-visual-bg">
          <div className={`slide ${activeSlide === 0 ? 'active' : ''}`}><img src="/assest/bodigala.jpeg" alt="Bodigala" /></div>
          <div className={`slide ${activeSlide === 1 ? 'active' : ''}`}><img src="/assest/hulangala.jpeg" alt="Hulangala" /></div>
          <div className={`slide ${activeSlide === 2 ? 'active' : ''}`}><img src="/assest/ranwan.jpeg" alt="Ranwan" /></div>
        </div>
        <div className="auth-visual-overlay"></div>
        <div className="auth-visual-content">
          <div className="auth-visual-quote">"Adventure <span>awaits</span> in every corner of this emerald isle."</div>
          <div className="auth-visual-sub">Join thousands of travelers who have discovered the magic of Sri Lanka.</div>
          <div className="visual-dots">
            {[0, 1, 2].map((idx) => (
              <button key={idx} className={`vdot ${activeSlide === idx ? 'active' : ''}`} onClick={() => setActiveSlide(idx)}></button>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <p style={{ fontSize: '0.8rem', letterSpacing: '2px', color: '#C9A84C', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Start Your Journey</p>
          <h1>Create <span>Account</span></h1>
          <p className="subtitle">Join us to explore the Pearl of the Indian Ocean</p>
          
          <div className="type-toggle" style={{ marginBottom: '2rem' }}>
            <div className="toggle-wrap" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button type="button" className={`toggle-btn ${formData.isLocal ? 'active' : ''}`} style={{ flex: 1, padding: '0.7rem', borderRadius: '50px', border: 'none', background: formData.isLocal ? '#C9A84C' : 'transparent', color: formData.isLocal ? '#050D10' : '#8BA8AE', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: 600, fontSize: '0.85rem' }} onClick={() => setFormData({...formData, isLocal: true})}>🇱🇰 Local</button>
              <button type="button" className={`toggle-btn ${!formData.isLocal ? 'active' : ''}`} style={{ flex: 1, padding: '0.7rem', borderRadius: '50px', border: 'none', background: !formData.isLocal ? '#C9A84C' : 'transparent', color: !formData.isLocal ? '#050D10' : '#8BA8AE', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: 600, fontSize: '0.85rem' }} onClick={() => setFormData({...formData, isLocal: false})}>✈️ Foreigner</button>
            </div>
          </div>
          
          {error && <div style={{ color: '#FF6B6B', margin: '0 0 1rem 0' }}>{error}</div>}

          {phase === 1 ? (
            <>
              <form onSubmit={requestOtp}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" id="name" className="form-control" placeholder="Dilshan" onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <input type="text" id="username" className="form-control" placeholder="dilshan_sl" onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" id="email" className="form-control" placeholder="your@email.com" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div className="pass-wrap">
                    <input type={showPass ? "text" : "password"} id="password" className="form-control" placeholder="••••••••" onChange={handleChange} required />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      <i className={`fas fa-eye${showPass ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                  <div className="strength-bar">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className="strength-seg" style={{ background: strength >= s ? colors[strength - 1] : 'rgba(255,255,255,0.1)' }}></div>
                    ))}
                  </div>
                  <div className="strength-label">
                    {formData.password ? `Strength: ${labels[strength-1]}` : 'Password strength'}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div className="pass-wrap">
                    <input type={showPass ? "text" : "password"} id="confirm" className="form-control" placeholder="••••••••" onChange={handleChange} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.98rem', padding: '0.95rem' }}>
                  <i className="fas fa-envelopes-bulk"></i> Send Verification Code
                </button>
              </form>
              <div className="auth-switch">
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </>
          ) : (
            <div className="otp-verification-panel" style={{ marginTop: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                  <i className="fas fa-envelope-open-text"></i>
                </div>
                <h3 style={{ color: '#fff', fontFamily: "'Cinzel', serif", marginBottom: '0.5rem' }}>Verify Your Email</h3>
                <p style={{ color: '#8BA8AE', fontSize: '0.9rem' }}>We sent a 6-digit code to <strong>{formData.email}</strong>. Enter it below to complete registration.</p>
              </div>

              <form onSubmit={verifyOtpAndSignup}>
                <div className="form-group" style={{ textAlign: 'center' }}>
                  <input type="text" className="form-control" placeholder="------" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 'bold' }} value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.98rem', padding: '0.95rem', marginTop: '1rem' }}>
                  <i className="fas fa-check-circle"></i> Verify & Create Account
                </button>
                <button type="button" onClick={() => setPhase(1)} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', border: 'none' }}>
                  <i className="fas fa-arrow-left"></i> Back to start
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
