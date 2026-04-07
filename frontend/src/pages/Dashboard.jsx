import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import '../css/dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch live bookings
    fetch(`${API_BASE_URL}/bookings?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Reveal
    setTimeout(() => {
      document.querySelector('.dashboard-wrap')?.classList.add('visible');
    }, 100);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCancel = async (id) => {
    if(!window.confirm('Are you sure you want to cancel this booking? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, { method: 'PUT' });
      if(res.ok) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      }
    } catch(err) {
      console.error(err);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-wrap reveal scale">
        <div className="dash-sidebar">
          <div className="dash-user">
            <div className="dash-avatar">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="dash-name">{user.name}</div>
            <div className="dash-email">{user.email}</div>
          </div>
          <div className="dash-nav">
            <button className={`dash-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
              <i className="fas fa-ticket-alt"></i> My Bookings
            </button>
            <button className={`dash-nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <i className="fas fa-user-circle"></i> Profile Settings
            </button>
            <button className="dash-nav-btn" onClick={handleLogout} style={{ color: '#FF6B6B', marginTop: '1rem' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="dash-content">
          {activeTab === 'bookings' && (
            <div className="reveal visible">
              <div className="review-box" style={{ marginBottom: '3rem', padding: '1.5rem', background: 'rgba(201,168,76,0.05)', borderRadius: '20px', border: '1px solid rgba(201,168,76,0.1)' }}>
                <h3 style={{ color: '#C9A84C', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                  <i className="fas fa-star"></i> Share Your Experience
                </h3>
                <p style={{ color: '#8BA8AE', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Travelers love hearing about your journey! Submit a review for admin approval.</p>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const comment = form.comment.value;
                  const rating = parseInt(form.rating.value);
                  const userId = user.id || user._id;

                  if (!userId) {
                    alert('User ID missing. Try logging out and back in.');
                    return;
                  }

                  setSubmitting(true);
                  try {
                    const res = await fetch(`${API_BASE_URL}/reviews`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        user: userId, 
                        name: user.name || 'Anonymous Guest', 
                        rating, 
                        comment 
                      })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      alert('Review submitted for approval! Thank you.');
                      form.reset();
                    } else {
                      alert(`Submission Failed: ${data.error || 'Check fields'}`);
                    }
                  } catch (err) {
                    alert('Server error. Please ensure your backend is running.');
                  } finally {
                    setSubmitting(false);
                  }
                }} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Rating</label>
                    <select name="rating" className="form-control" required style={{ padding: '0.5rem' }}>
                      <option value="5">⭐⭐⭐⭐⭐</option>
                      <option value="4">⭐⭐⭐⭐</option>
                      <option value="3">⭐⭐⭐</option>
                      <option value="2">⭐⭐</option>
                      <option value="1">⭐</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Your Story</label>
                    <input name="comment" className="form-control" placeholder="Describe your trip..." required style={{ padding: '0.5rem' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>

              <h2 className="dash-title">My Bookings</h2>
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.length > 0 ? (
                bookings.map((b) => (
                  <div className="booking-ticket" key={b._id}>
                    <div className="ticket-edge"></div>
                    <div className="ticket-info">
                      <h4>{b.hotelName}</h4>
                      <div className="ticket-sub">
                        <span><i className="fas fa-map-marker-alt"></i> {b.destination}</span>
                        <span><i className="far fa-calendar-alt"></i> {b.checkin ? b.checkin.substring(0, 10) : ''} to {b.checkout ? b.checkout.substring(0, 10) : ''}</span>
                        <span><i className="fas fa-user"></i> {b.adults} Guests</span>
                      </div>
                      <div className="ticket-ref">REF: {b.bookingRef}</div>
                    </div>
                    <div className="ticket-meta">
                      <div className={`ticket-status ${b.status === 'Confirmed' ? 'status-confirmed' : ''}`} style={b.status === 'Cancelled' ? { background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.2)' } : b.status === 'Completed' ? { background: 'rgba(255,255,255,0.1)', color: '#8BA8AE', border: '1px solid rgba(255,255,255,0.2)' } : {}}>
                        {b.status}
                      </div>
                      <div className="ticket-price">${b.totalPrice}</div>
                      {b.status === 'Confirmed' && (
                        <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', marginTop: '0.5rem' }} onClick={() => handleCancel(b._id)}>Cancel</button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>You have no bookings yet.</p>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="reveal visible profile-form">
              <h2 className="dash-title">Profile Settings</h2>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue={user.email} disabled />
                </div>
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
