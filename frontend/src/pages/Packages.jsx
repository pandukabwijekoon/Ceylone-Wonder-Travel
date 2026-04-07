import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/packages.css';

function Packages() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If not logged in, we let them see the page but they can't book
      setUser({ isLocal: false }); // Show content for public/unlogged foreigners
    }
    window.scrollTo(0, 0);
  }, []);

  const tours = [
    {
      id: 1,
      name: "The Tropical Pearl",
      duration: "3 Days / 2 Nights",
      price: "299",
      tag: "Best for Transit",
      img: "/assest/queens hotel.jpeg",
      itinerary: [
        "Day 1: Airport Pickup -> Colombo City Tour",
        "Day 2: Galle Fort & Coastal Safari",
        "Day 3: Souvenir Shopping -> Airport Dropoff"
      ]
    },
    {
      id: 2,
      name: "Highland Grandeur",
      duration: "7 Days / 6 Nights",
      price: "649",
      tag: "Most Popular",
      img: "/assest/ambuliuwawa.jpeg",
      itinerary: [
        "Day 1: Airport -> Pinnawala -> Kandy",
        "Day 2: Kandy Temple & Cultural Show",
        "Day 3-4: Nuwara Eliya Tea Estates",
        "Day 5-6: Ella Nine Arch Bridge & Hiking",
        "Day 7: Scenic Drive -> Airport"
      ]
    },
    {
      id: 3,
      name: "Ancient Dynasty Tour",
      duration: "10 Days / 9 Nights",
      price: "899",
      tag: "History & Nature",
      img: "/assest/ranwan.jpeg",
      itinerary: [
        "Day 1: Airport -> Negombo Beach",
        "Day 2-3: Sigiriya Rock & Dambulla Caves",
        "Day 4-5: Anuradhapura Ancient City",
        "Day 6-7: East Coast (Nilaveli) Relaxation",
        "Day 8-9: Kandy City -> Colombo",
        "Day 10: Final Departure Dropoff"
      ]
    }
  ];

  if (user && user.isLocal) {
    return (
      <div className="packages-page">
        <div className="container">
          <div className="restricted-overlay reveal visible">
            <div className="restricted-icon"><i className="fas fa-lock"></i></div>
            <h2>Exclusive Content</h2>
            <p>We're sorry, but these specific curated tour packages are exclusively designed for <strong>International Travelers</strong> visiting Sri Lanka.</p>
            <p style={{ fontSize: '0.9rem', color: 'rgba(201,168,76,0.7)' }}>Local residents can explore our Hotel Booking and Destination guides for the best local experiences.</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="packages-page">
      <section className="packages-hero">
        <div className="container">
          <div className="badge reveal visible">✦ International Exclusive</div>
          <h1>Discover <span>Curated Sri Lanka</span></h1>
          <p>Seamless all-inclusive journeys starting directly from Bandaranaike International Airport (CMB). We handle the logistics, you live the wonder.</p>
        </div>
      </section>

      <section className="packages-grid">
        {tours.map(tour => (
          <div key={tour.id} className="package-card reveal visible">
            <div className="package-img">
              <img src={tour.img} alt={tour.name} />
              <div className="package-tag">{tour.tag}</div>
            </div>
            <div className="package-info">
              <h3>{tour.name}</h3>
              <div className="package-meta">
                <span><i className="fas fa-clock"></i> {tour.duration}</span>
                <span><i className="fas fa-plane-arrival"></i> Airport Pickup</span>
              </div>
              <div className="itinerary">
                {tour.itinerary.map((step, i) => (
                  <div key={i} className="itinerary-step">{step}</div>
                ))}
              </div>
              <div className="package-footer">
                <div className="package-price">
                  <span className="price-label">Starts from</span>
                  <span className="price-val">${tour.price}</span>
                </div>
                <Link to="/booking" className="btn btn-primary">Book Now</Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="container" style={{ paddingBottom: '5rem' }}>
        <div style={{ background: 'rgba(11,61,69,0.3)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '24px', padding: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", marginBottom: '1rem' }}>Need a Custom Itinerary?</h2>
          <p style={{ color: '#8BA8AE', marginBottom: '2rem' }}>Our travel experts can design a personalized journey just for you. Tell us where you want to go.</p>
          <Link to="/trip-planner" className="btn btn-primary">Contact Trip Planner</Link>
        </div>
      </section>
    </div>
  );
}

export default Packages;
