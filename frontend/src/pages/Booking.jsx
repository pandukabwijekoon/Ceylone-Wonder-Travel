import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../api/config';
import '../css/booking.css';

const allHotels = {
  'Kandy': [
    { name: 'Ceylon Grand Kandy', price: 180, stars: 5, specs: '5-Star • Temple View • Infinity Pool' },
    { name: 'Kandy Heritage Inn', price: 100, stars: 4, specs: '4-Star • Colonial Style • Tropical Garden' }
  ],
  'Colombo': [
    { name: 'Colombo City Center Hotel', price: 150, stars: 5, specs: '5-Star • Rooftop Pool • Ocean View' },
    { name: 'Ocean Breeze Boutique', price: 90, stars: 4, specs: '4-Star • Near Beach • Modern Styling' }
  ],
  'Galle': [
    { name: 'Galle Fort Manor', price: 220, stars: 5, specs: '5-Star • Historic Architecture • Luxury Suites' },
    { name: 'Coastal Retreat Galle', price: 120, stars: 4, specs: '4-Star • Beachfront • Seafood Restaurant' }
  ],
  'Nuwara Eliya': [
    { name: 'Tea Estate Bungalow', price: 280, stars: 5, specs: '5-Star • Tea Plantation View • Butler Service' },
    { name: 'Highland Cozy Chalet', price: 140, stars: 4, specs: '4-Star • Mountain View • Cozy Fireplace' }
  ],
  'default': [
    { name: 'Select a Destination First', price: 0, stars: 0, specs: 'Please select a destination above to see available hotels in that area.' }
  ]
};

const roomPrices = { Standard: 80, Deluxe: 130, Suite: 220, Villa: 380 };

function Booking() {
  const [visitorType, setVisitorType] = useState('local');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    nic: '', nationality: '', passport: '', visaType: '',
    destination: '', checkin: '', checkout: '', adults: '1', roomType: '',
    hotel: '', requests: '', agreeTerms: false, otp: ''
  });
  
  const currentHotels = formData.destination ? allHotels[formData.destination] : allHotels.default;
  
  const [summary, setSummary] = useState({ nights: 0, total: 0 });
  const [step, setStep] = useState(1);
  const [bookingRef, setBookingRef] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill for logged in users
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      try {
        const user = JSON.parse(userStr);
        setFormData(prev => ({
          ...prev,
          firstName: user.name ? user.name.split(' ')[0] : prev.firstName,
          lastName: user.name && user.name.split(' ').length > 1 ? user.name.split(' ')[1] : prev.lastName,
          email: user.email || prev.email
        }));
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  useEffect(() => {
    // Reveal logic
    const revealElements = () => {
      const reveals = document.querySelectorAll('.reveal, .reveal-right');
      const windowHeight = window.innerHeight;
      reveals.forEach(el => {
        if (el.getBoundingClientRect().top < windowHeight - 50) el.classList.add('visible');
      });
    };
    window.addEventListener('scroll', revealElements);
    setTimeout(revealElements, 100);
    return () => window.removeEventListener('scroll', revealElements);
  }, []);

  useEffect(() => {
    // Calculate Summary
    let nights = 0;
    let total = 0;
    if (formData.checkin && formData.checkout) {
      const inDate = new Date(formData.checkin);
      const outDate = new Date(formData.checkout);
      const diffTime = Math.abs(outDate - inDate);
      nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (outDate <= inDate) nights = 0;
    }
    
    if (nights > 0) {
      const hotelData = currentHotels.find(h => h.name === formData.hotel);
      const baseRoomPrice = formData.roomType ? roomPrices[formData.roomType] : 0;
      const hotelPrice = hotelData ? hotelData.price : 0;
      total = nights * (hotelPrice + baseRoomPrice);
    }
    setSummary({ nights, total });
  }, [formData.checkin, formData.checkout, formData.hotel, formData.roomType, formData.destination]);

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;
    if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => {
        const newData = { ...prev, [id]: value };
        if (id === 'destination') {
           const newHotels = value ? allHotels[value] : allHotels.default;
           newData.hotel = newHotels[0].name; // auto-select first hotel in the new destination
        }
        return newData;
      });
    }
  };

  const submitBooking = async () => {
    if(!formData.agreeTerms) {
      setError('You must agree to the Terms & Conditions.');
      return;
    }
    setError('');

    const payload = {
      isLocal: visitorType === 'local',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      destination: formData.destination,
      checkin: formData.checkin,
      checkout: formData.checkout,
      adults: parseInt(formData.adults),
      roomType: formData.roomType,
      hotelName: formData.hotel,
      totalPrice: summary.total,
      requests: formData.requests,
      otp: formData.otp,
      ...(visitorType === 'local' 
        ? { nic: formData.nic } 
        : { nationality: formData.nationality, passport: formData.passport, visaType: formData.visaType })
    };

    if (step === 1) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/bookings/send-otp-booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        if (res.ok) {
          setStep(1.5);
          window.scrollTo({ top: document.querySelector('.booking-section').offsetTop - 100, behavior: 'smooth' });
        } else {
          const data = await res.json();
          setError(data.error || 'Failed to send verification code');
        }
      } catch (err) {
        setError('Connection error');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 1.5) {
      if (!formData.otp) {
        setError('Please enter the verification code sent to your email.');
        return;
      }
      setStep(2);
      window.scrollTo({ top: document.querySelector('.booking-section').offsetTop - 100, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      setLoading(true);
      setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if(res.ok) {
            setBookingRef(data.bookingRef);
            setStep(3);
          } else {
            setError(data.error || 'Failed to submit booking');
          }
        } catch(err) {
          setError('Server connection error. Is the backend running?');
        } finally {
          setLoading(false);
        }
      }, 2000);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div className="booking-hero-bg"></div>
        <div className="booking-hero-overlay"></div>
        <div className="booking-hero-content">
          <div className="badge">🏨 Hotel Booking</div>
          <h1 className="section-title" style={{ WebkitTextFillColor: 'white', color: 'white' }}>Find Your Perfect Stay</h1>
          <p>Luxury hotels, boutique guesthouses, and everything in between — book your ideal accommodation in Sri Lanka.</p>
        </div>
      </div>

      <section className="booking-section">
        <div className="container">
          
          <div className="type-toggle">
            <div className="toggle-wrap">
              <button className={`toggle-btn ${visitorType === 'local' ? 'active' : ''}`} onClick={() => setVisitorType('local')}>🇱🇰 Local Resident</button>
              <button className={`toggle-btn ${visitorType === 'foreign' ? 'active' : ''}`} onClick={() => setVisitorType('foreign')}>✈️ International Visitor</button>
            </div>
          </div>

          <div className="booking-wrap">
            <div className="booking-form-card reveal">
              
              <div className="booking-steps" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="step-num" style={{ margin: '0 auto' }}>{step > 1 ? '✓' : '1'}</div>
                  <span style={{ fontSize: '0.8rem', color: '#8BA8AE', marginTop: '0.5rem', display: 'block' }}>Details</span>
                </div>
                <div className={`step ${step >= 1.5 ? 'active' : ''} ${step > 1.5 ? 'completed' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="step-num" style={{ margin: '0 auto' }}>{step > 1.5 ? '✓' : '1.5'}</div>
                  <span style={{ fontSize: '0.8rem', color: '#8BA8AE', marginTop: '0.5rem', display: 'block' }}>Verify</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="step-num" style={{ margin: '0 auto' }}>{step > 2 ? '✓' : '2'}</div>
                  <span style={{ fontSize: '0.8rem', color: '#8BA8AE', marginTop: '0.5rem', display: 'block' }}>Payment</span>
                </div>
                <div className={`step ${step === 3 ? 'active completed' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="step-num" style={{ margin: '0 auto' }}>3</div>
                  <span style={{ fontSize: '0.8rem', color: '#8BA8AE', marginTop: '0.5rem', display: 'block' }}>Success</span>
                </div>
              </div>

              {step === 1 && (
                <>
                  <h2>Book Your Hotel</h2>
                  <p>Fill in your details to secure your reservation</p>
                  {error && <div style={{ color: '#FF6B6B', marginBottom: '1rem' }}>{error}</div>}

                  <div className="form-section-label"><i className="fas fa-user"></i> Personal Information</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input type="text" className="form-control" id="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input type="text" className="form-control" id="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  {visitorType === 'local' ? (
                    <>
                      <div className="section-divider"></div>
                      <div className="form-section-label"><i className="fas fa-id-card"></i> Local Resident Details</div>
                      <div className="form-group">
                        <label className="form-label">NIC Number *</label>
                        <input type="text" className="form-control" id="nic" value={formData.nic} onChange={handleChange} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="section-divider"></div>
                      <div className="form-section-label"><i className="fas fa-passport"></i> International Visitor Details</div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Nationality *</label>
                          <input type="text" className="form-control" id="nationality" value={formData.nationality} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Passport Number *</label>
                          <input type="text" className="form-control" id="passport" value={formData.passport} onChange={handleChange} />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="section-divider"></div>
                  <div className="form-section-label"><i className="fas fa-calendar-alt"></i> Booking Details</div>
                  <div className="form-group">
                    <label className="form-label">Destination *</label>
                    <select className="form-control" id="destination" value={formData.destination} onChange={handleChange}>
                      <option value="">Select Destination</option>
                      <option value="Kandy">Kandy</option><option value="Colombo">Colombo</option>
                      <option value="Galle">Galle</option><option value="Nuwara Eliya">Nuwara Eliya</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Check-in Date *</label>
                      <input type="date" className="form-control" id="checkin" value={formData.checkin} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Check-out Date *</label>
                      <input type="date" className="form-control" id="checkout" value={formData.checkout} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Adults *</label>
                      <select className="form-control" id="adults" value={formData.adults} onChange={handleChange}>
                        <option>1</option><option>2</option><option>3</option><option>4</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Room Type *</label>
                      <select className="form-control" id="roomType" value={formData.roomType} onChange={handleChange}>
                        <option value="">Select Room</option>
                        <option value="Standard">Standard Room (+$80)</option>
                        <option value="Deluxe">Deluxe Room (+$130)</option>
                        <option value="Suite">Suite (+$220)</option>
                        <option value="Villa">Private Villa (+$380)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-section-label" style={{ marginTop: '1rem' }}><i className="fas fa-hotel"></i> Select Hotel</div>
                  <div className="hotel-list">
                    {currentHotels.map(h => (
                      <label key={h.name} className={`hotel-option ${formData.hotel === h.name ? 'selected' : ''}`} style={{ opacity: h.price === 0 ? 0.6 : 1, pointerEvents: h.price === 0 ? 'none' : 'auto' }}>
                        <input type="radio" name="hotel" value={h.name} checked={formData.hotel === h.name} onChange={handleChange} disabled={h.price === 0} />
                        <div className="hotel-option-info">
                          <h5>{h.name}</h5>
                          {h.stars > 0 && <div className="hotel-stars">{'★'.repeat(h.stars)}</div>}
                          <span>{h.specs}</span>
                        </div>
                        {h.price > 0 && <div className="hotel-price">${h.price}/night</div>}
                      </label>
                    ))}
                  </div>

                  <div className="section-divider"></div>
                  <div className="form-group">
                    <label className="form-label">Special Requests</label>
                    <textarea className="form-control" id="requests" rows="3" value={formData.requests} onChange={handleChange}></textarea>
                  </div>

                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                      <input type="checkbox" id="agreeTerms" style={{ accentColor: '#C9A84C', marginTop: '3px' }} checked={formData.agreeTerms} onChange={handleChange} />
                      <span style={{ fontSize: '0.85rem', color: '#8BA8AE' }}>I agree to the <a href="#" style={{ color: '#C9A84C' }}>Terms & Conditions</a></span>
                    </label>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', fontSize: '1rem', padding: '1rem' }} onClick={submitBooking} disabled={loading}>
                    {loading ? 'Sending...' : 'Proceed to Verification'}
                  </button>
                </>
              )}

              {step === 1.5 && (
                <div className="reveal visible scale" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Verify Your Booking</h3>
                  <p style={{ color: '#8BA8AE', marginBottom: '1.5rem' }}>We've sent a 6-digit verification code to <strong>{formData.email}</strong>. Please enter it below to proceed to payment.</p>
                  
                  {error && <div style={{ color: '#FF6B6B', marginBottom: '1rem' }}>{error}</div>}
                  
                  <div className="form-group" style={{ maxWidth: '300px', margin: '0 auto 2rem' }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="otp" 
                      placeholder="Enter 6-digit code" 
                      value={formData.otp} 
                      onChange={handleChange} 
                      maxLength="6"
                      style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px', fontWeight: 'bold' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>Back</button>
                    <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={submitBooking}>Verify & Pay</button>
                  </div>
                </div>
              )}


              {step === 2 && (
                <div className="payment-form reveal visible scale" style={{ background: 'rgba(11,61,69,0.3)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(201,168,76,0.3)', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: "'Cinzel', serif", color: '#C9A84C', marginBottom: '1.5rem' }}>Secure Payment</h3>
                  <p style={{ color: '#8BA8AE', marginBottom: '2rem' }}>You are about to pay <strong>${summary.total}</strong> for {summary.nights} nights at {formData.hotel}.</p>
                  
                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
                    <div style={{ background: '#050D10', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span style={{ color: '#fff' }}><i className="fab fa-cc-stripe" style={{ color: '#6772E5', fontSize: '1.5rem', marginRight: '10px' }}></i> Pay with Stripe</span>
                      <i className="fas fa-circle" style={{ color: '#1ABC9C' }}></i>
                    </div>
                    <div style={{ background: '#050D10', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'not-allowed', opacity: 0.5 }}>
                      <span style={{ color: '#fff' }}><i className="fab fa-paypal" style={{ color: '#003087', fontSize: '1.5rem', marginRight: '10px' }}></i> PayPal (Coming Soon)</span>
                      <i className="far fa-circle" style={{ color: '#8BA8AE' }}></i>
                    </div>
                  </div>

                  {error && <div style={{ color: '#FF6B6B', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setStep(1)} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
                      Back
                    </button>
                    <button type="button" className="btn btn-primary" onClick={submitBooking} disabled={loading} style={{ flex: 2, justifyContent: 'center' }}>
                      {loading ? 'Processing...' : `Pay $${summary.total}`}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking-success show">
                  <div className="success-icon">✅</div>
                  <h2 style={{ fontFamily: "'Cinzel',serif", marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
                  <p style={{ color: '#8BA8AE', marginBottom: '1rem' }}>Your reservation has been successfully placed.</p>
                  <div className="booking-ref">{bookingRef}</div>
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/dashboard" className="btn btn-primary"><i className="fas fa-ticket-alt"></i> View My Bookings</Link>
                    <Link to="/" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.05)' }}><i className="fas fa-home"></i> Home</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="summary-card reveal-right">
              <h3>📋 Booking Summary</h3>
              <div className="summary-row"><span className="label">Destination</span><span className="value">{formData.destination || '—'}</span></div>
              <div className="summary-row"><span className="label">Check-in</span><span className="value">{formData.checkin || '—'}</span></div>
              <div className="summary-row"><span className="label">Check-out</span><span className="value">{formData.checkout || '—'}</span></div>
              <div className="summary-row"><span className="label">Nights</span><span className="value">{summary.nights > 0 ? summary.nights : '—'}</span></div>
              <div className="summary-row"><span className="label">Guests</span><span className="value">{formData.adults}</span></div>
              <div className="summary-row"><span className="label">Room Type</span><span className="value">{formData.roomType || '—'}</span></div>
              <div className="summary-total">
                <span className="label">Estimated Total</span>
                <span className="amount">${summary.total}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#8BA8AE', textAlign: 'center' }}>*Final price confirmed at checkout. Taxes may apply.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Booking;
