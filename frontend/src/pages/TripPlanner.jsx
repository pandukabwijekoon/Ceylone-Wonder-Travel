import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import '../css/tripplanner.css';

function TripPlanner() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    arrivalDate: '', duration: '',
    travelers: '1', budget: '',
    interests: [], requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      try {
        const user = JSON.parse(userStr);
        setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const toggleInterest = (interest) => {
    const updated = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: updated });
  };

  const interestList = ['Beach & Sun', 'Hiking & Mountains', 'Ancient History', 'Wild Life', 'Tea Estates', 'Night Life', 'Adventure Sports', 'Photography'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/bookings/contact-planner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: formData.interests.join(', ')
        })
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send inquiry');
      }
    } catch (err) {
      setError('Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="planner-page">
        <div className="container" style={{ marginTop: '5rem' }}>
          <div className="planner-success glass-card reveal visible">
            <i className="fas fa-paper-plane"></i>
            <h2>Inquiry Sent!</h2>
            <p>Thank you for choosing Ceylon Wonders. Our trip experts have received your custom request and will reach out to <strong>{formData.email}</strong> within 24 hours with a personalized proposal.</p>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/packages" className="btn btn-outline">Back to Packages</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="planner-page">
      <section className="planner-header">
        <div className="container">
          <div className="badge reveal visible">✦ Tailor-Made Journey</div>
          <h1>Plan Your <span>Ideal Trip</span></h1>
          <p>Tell us your preferences and let our local experts craft the perfect Sri Lankan experience just for you.</p>
        </div>
      </section>

      <div className="container">
        <div className="planner-container reveal visible">
          {error && <div style={{ color: '#FF6B6B', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="planner-form-section">
              <h3><i className="fas fa-user-circle"></i> Contact Information</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" id="name" className="form-control" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input type="text" id="phone" className="form-control" placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="planner-form-section">
              <h3><i className="fas fa-calendar-alt"></i> Trip Logistics</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Estimated Arrival</label>
                  <input type="date" id="arrivalDate" className="form-control" value={formData.arrivalDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (Days)</label>
                  <input type="number" id="duration" className="form-control" placeholder="e.g. 7" value={formData.duration} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Number of Travelers</label>
                  <select id="travelers" className="form-control" value={formData.travelers} onChange={handleChange}>
                    <option value="1">1 Person (Solo)</option>
                    <option value="2">2 Persons (Couple)</option>
                    <option value="3-5">3 - 5 Persons (Family/Group)</option>
                    <option value="6-10">6 - 10 Persons</option>
                    <option value="10+">Large Group (10+)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Approx. Budget (Optional)</label>
                  <input type="text" id="budget" className="form-control" placeholder="e.g. $1500 per person" value={formData.budget} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="planner-form-section">
              <h3><i className="fas fa-heart"></i> Personal Interests</h3>
              <p style={{ fontSize: '0.85rem', color: '#8BA8AE', marginBottom: '1rem' }}>Select everything you want to experience:</p>
              <div className="interests-grid">
                {interestList.map(interest => (
                  <div 
                    key={interest} 
                    className={`interest-tag ${formData.interests.includes(interest) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </div>
                ))}
              </div>
            </div>

            <div className="planner-form-section">
              <h3><i className="fas fa-edit"></i> Additional details</h3>
              <div className="form-group">
                <label className="form-label">Any specific requirements or notes?</label>
                <textarea 
                  id="requirements" 
                  className="form-control" 
                  rows="4" 
                  placeholder="Tell us about special occasions, dietary needs, or specific places you MUST visit..."
                  value={formData.requirements}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }} disabled={loading}>
              {loading ? 'Sending Inquiry...' : 'Generate My Custom Itinerary'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TripPlanner;
