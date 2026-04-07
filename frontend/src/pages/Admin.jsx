import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api/config';
import '../css/dashboard.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = { revenue: 14250, bookings: 42, activeUsers: 156 };

  const recentBookings = [
    { ref: 'CW-8921B4', user: 'Dilshan', hotel: 'Ceylon Grand', date: '2024-05-12', price: 660, status: 'Confirmed' },
    { ref: 'CW-11X9P2', user: 'Sarah Jen', hotel: 'Lakeside Boutique', date: '2024-06-01', price: 390, status: 'Pending' }
  ];

  useEffect(() => {
    // Reveal
    setTimeout(() => {
      document.querySelector('.dashboard-wrap')?.classList.add('visible');
    }, 100);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-wrap reveal scale">
        <div className="dash-sidebar" style={{ background: 'rgba(26,188,156,0.1)', borderColor: 'rgba(26,188,156,0.3)' }}>
          <div className="dash-user">
            <div className="dash-avatar" style={{ background: '#1ABC9C', color: '#fff' }}><i className="fas fa-crown"></i></div>
            <div className="dash-name" style={{ color: '#1ABC9C' }}>Admin Portal</div>
            <div className="dash-email">Control Panel</div>
          </div>
          <div className="dash-nav">
            <button className={`dash-nav-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <i className="fas fa-chart-line"></i> Dashboard Overview
            </button>
            <button className={`dash-nav-btn ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
              <i className="fas fa-hotel"></i> Manage Hotels
            </button>
            <button className={`dash-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              <i className="fas fa-star"></i> Review Moderation
            </button>
          </div>
        </div>

        <div className="dash-content">
          <ReviewModeration active={activeTab === 'reviews'} />
          
          {activeTab === 'overview' && (
            <div className="reveal visible">
              <h2 className="dash-title">Platform Overview</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(26,188,156,0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(26,188,156,0.2)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#8BA8AE', textTransform: 'uppercase' }}>Total Revenue</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#1ABC9C' }}>${stats.revenue}</div>
                </div>
                <div style={{ background: 'rgba(201,168,76,0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#8BA8AE', textTransform: 'uppercase' }}>Total Bookings</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#C9A84C' }}>{stats.bookings}</div>
                </div>
                <div style={{ background: 'rgba(243,156,18,0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(243,156,18,0.2)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#8BA8AE', textTransform: 'uppercase' }}>Active Users</div>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#F39C12' }}>{stats.activeUsers}</div>
                </div>
              </div>

              <h3>Recent Bookings</h3>
              <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    <th style={{ padding: '1rem', color: '#8BA8AE', fontWeight: '500' }}>Reference</th>
                    <th style={{ padding: '1rem', color: '#8BA8AE', fontWeight: '500' }}>User</th>
                    <th style={{ padding: '1rem', color: '#8BA8AE', fontWeight: '500' }}>Hotel</th>
                    <th style={{ padding: '1rem', color: '#8BA8AE', fontWeight: '500' }}>Price</th>
                    <th style={{ padding: '1rem', color: '#8BA8AE', fontWeight: '500' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem', color: '#C9A84C' }}>{b.ref}</td>
                      <td style={{ padding: '1rem' }}>{b.user}</td>
                      <td style={{ padding: '1rem' }}>{b.hotel}</td>
                      <td style={{ padding: '1rem' }}>${b.price}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`ticket-status ${b.status === 'Confirmed' ? 'status-confirmed' : ''}`} style={{ marginBottom: 0 }}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="reveal visible">
              <h2 className="dash-title">Manage Hotels</h2>
              <p style={{ color: '#8BA8AE' }}>Hotel catalog management interface...</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}><i className="fas fa-plus"></i> Add New Hotel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewModeration({ active }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/admin`);
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (active) fetchReviews();
  }, [active]);

  const handleApprove = async (id) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, { method: 'PUT' });
    if (res.ok) fetchReviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) fetchReviews();
  };

  if (!active) return null;

  return (
    <div className="reveal visible">
      <h2 className="dash-title">Review Moderation</h2>
      <p style={{ color: '#8BA8AE', marginBottom: '2rem' }}>Review and approve guest testimonials before they appear on the homepage.</p>
      
      {loading ? <p>Loading reviews...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.length === 0 ? <p>No reviews found.</p> : reviews.map(r => (
            <div key={r._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', color: '#C9A84C', marginBottom: '0.5rem' }}>
                    {[...Array(r.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{r.name}</div>
                  <div style={{ color: '#8BA8AE', fontSize: '0.85rem' }}>{r.comment}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {r.status === 'pending' && (
                    <button onClick={() => handleApprove(r._id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#1ABC9C' }}>Approve</button>
                  )}
                  <button onClick={() => handleDelete(r._id)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: '#FF6B6B', color: '#FF6B6B' }}>Delete</button>
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '4px', background: r.status === 'approved' ? 'rgba(26,188,156,0.1)' : 'rgba(243,156,18,0.1)', color: r.status === 'approved' ? '#1ABC9C' : '#F39C12' }}>
                  {r.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>Submitted: {new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
