import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../api/config';
import '../css/home.css';

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <section className="testimonials" id="reviews" style={{ padding: '5rem 0' }}>
      <div className="container">
        <div className="badge reveal visible">✦ Guest Experiences</div>
        <h2 className="section-title reveal visible">What Our Travelers Say</h2>
        <div className="gold-divider reveal visible"></div>

        {reviews.length === 0 ? (
          <div className="testi-empty reveal visible" style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(201,168,76,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
            <h4 style={{ color: '#C9A84C', marginBottom: '0.5rem' }}>Be the First to Share Your Story</h4>
            <p style={{ color: '#8BA8AE', maxWidth: '500px', margin: '0 auto' }}>No testimonials have been approved yet. Join our early explorers and share your Sri Lankan adventure from your dashboard!</p>
          </div>
        ) : (
          <div className="testi-grid">
            {reviews.map((r, i) => (
            <div className="testi-card reveal visible" key={r._id} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="testi-stars">
                {[...Array(r.rating)].map((_, starIndex) => (
                  <i key={starIndex} className="fas fa-star"></i>
                ))}
              </div>
              <p className="testi-text">"{r.comment}"</p>
              <div className="testi-author">
                <div className="testi-avatar">{r.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="testi-name">{r.name}</div>
                  <div className="testi-country">Verified Explorer</div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewsSection;
