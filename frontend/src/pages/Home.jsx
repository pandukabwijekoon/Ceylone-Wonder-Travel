import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewsSection from '../components/ReviewsSection';
import '../css/home.css';

const AnimatedCounter = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const duration = 2500; // 2.5 seconds
    const incrementTime = Math.max(10, Math.floor(duration / target)); // Max 100fps
    const steps = duration / incrementTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return <span ref={counterRef}>{count}{suffix}</span>;
};

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // 3D Parallax Effect
    const handleMouseMove = (e) => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const moveX = (clientX - innerWidth / 2) / 25;
        const moveY = (clientY - innerHeight / 2) / 25;
        heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);

    // Reveal Logic (from animations.css)
    const revealElements = () => {
      const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      const windowHeight = window.innerHeight;
      reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', revealElements);
    // Trigger once on mount
    revealElements();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', revealElements);
    };
  }, []);

  // Simple auto slider for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* ==================== HERO ==================== */}
      <section className="hero" id="home">
        <div className="hero-bg-slider" id="heroBgSlider">
          <div className={`hero-slide ${activeSlide === 0 ? 'active' : ''}`}><img src="/assest/sridalada maligawa.jpeg" alt="Sri Dalada Maligawa Kandy" /></div>
          <div className={`hero-slide ${activeSlide === 1 ? 'active' : ''}`}><img src="/assest/ambuliuwawa.jpeg" alt="Ambuluwawa Tower" /></div>
          <div className={`hero-slide ${activeSlide === 2 ? 'active' : ''}`}><img src="/assest/mahameunava.jpeg" alt="Maha Mewuna Garden" /></div>
          <div className={`hero-slide ${activeSlide === 3 ? 'active' : ''}`}><img src="/assest/queens hotel.jpeg" alt="Queens Hotel Kandy" /></div>
          <div className={`hero-slide ${activeSlide === 4 ? 'active' : ''}`}><img src="/assest/polgolla (1).jpeg" alt="Polgolla Reservoir" /></div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-particles" id="heroParticles"></div>

        <div className="hero-content">
          <div className="hero-eyebrow">✦ Pearl of the Indian Ocean</div>
          <h1>
            <span className="line1">Discover the </span>
            <span className="line2">Magic of <span className="ceylon-text">Ceylon</span></span>
          </h1>
          <p className="hero-desc">From ancient temples to misty highlands, pristine beaches to colonial forts — Sri Lanka awaits with wonders beyond imagination.</p>
          <div className="hero-cta">
            <Link to="/explore" className="btn btn-primary"><i className="fas fa-compass"></i> Explore Now</Link>
            <Link to="/booking" className="btn btn-outline"><i className="fas fa-hotel"></i> Book Hotels</Link>
          </div>
        </div>

        <div className="hero-side-imgs" id="heroThumbs">
          <div className={`side-thumb ${activeSlide === 0 ? 'active' : ''}`} onClick={() => setActiveSlide(0)}><img src="/assest/sridalada maligawa.jpeg" alt="Kandy" /></div>
          <div className={`side-thumb ${activeSlide === 1 ? 'active' : ''}`} onClick={() => setActiveSlide(1)}><img src="/assest/ambuliuwawa.jpeg" alt="Ambuluwawa" /></div>
          <div className={`side-thumb ${activeSlide === 2 ? 'active' : ''}`} onClick={() => setActiveSlide(2)}><img src="/assest/mahameunava.jpeg" alt="Garden" /></div>
          <div className={`side-thumb ${activeSlide === 3 ? 'active' : ''}`} onClick={() => setActiveSlide(3)}><img src="/assest/queens hotel.jpeg" alt="Queens Hotel" /></div>
          <div className={`side-thumb ${activeSlide === 4 ? 'active' : ''}`} onClick={() => setActiveSlide(4)}><img src="/assest/polgolla (1).jpeg" alt="Polgolla" /></div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat"><div className="hero-stat-num">200+</div><div className="hero-stat-label">Destinations</div></div>
          <div className="hero-stat"><div className="hero-stat-num">50K+</div><div className="hero-stat-label">Happy Tourists</div></div>
          <div className="hero-stat"><div className="hero-stat-num">4.9★</div><div className="hero-stat-label">Rated</div></div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* ==================== MAIN PLACES ==================== */}
      <section className="places-section" id="places">
        <div className="container">
          <div className="badge reveal">✦ Top Destinations</div>
          <h2 className="section-title reveal">Sri Lanka's Finest Places</h2>
          <div className="gold-divider reveal"></div>
          <p className="section-subtitle reveal">Immerse yourself in the island's most iconic destinations, each offering a unique blend of culture, nature, and adventure.</p>

          <div className="places-grid">
            {/* Kandy */}
            <div className="place-card reveal delay-100">
              <div className="place-card-inner">
                <div className="place-card-front">
                  <img src="/assest/dalada maligawa.jpeg" alt="Kandy" />
                  <div className="overlay"></div>
                  <div className="info">
                    <div className="sub"><i className="fas fa-map-pin"></i> Central Province</div>
                    <h3>Kandy</h3>
                  </div>
                </div>
                <div className="place-card-back">
                  <h3>🏛️ Kandy</h3>
                  <p>The last royal capital of Sri Lanka, Kandy is home to the sacred Temple of the Tooth Relic, surrounded by misty mountains and a stunning lake.</p>
                  <div className="tags"><span className="tag">UNESCO Heritage</span><span className="tag">Cultural</span><span className="tag">Buddhist</span></div>
                  <Link to="/destination/kandy" className="card-btn">Explore <i className="fas fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
            {/* Colombo */}
            <div className="place-card reveal delay-200">
              <div className="place-card-inner">
                <div className="place-card-front">
                  <img src="/assest/kandy clock tower.jpeg" alt="Colombo" />
                  <div className="overlay"></div>
                  <div className="info">
                    <div className="sub"><i className="fas fa-map-pin"></i> Western Province</div>
                    <h3>Colombo</h3>
                  </div>
                </div>
                <div className="place-card-back">
                  <h3>🌆 Colombo</h3>
                  <p>Sri Lanka's vibrant capital blends colonial architecture with modern skyscrapers. Explore bustling markets, luxury malls, and scenic coastal promenades.</p>
                  <div className="tags"><span className="tag">City Life</span><span className="tag">Shopping</span><span className="tag">Nightlife</span></div>
                  <Link to="/destination/colombo" className="card-btn">Explore <i className="fas fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
            {/* Galle */}
            <div className="place-card reveal delay-300">
              <div className="place-card-inner">
                <div className="place-card-front">
                  <img src="/assest/bodigala.jpeg" alt="Galle" />
                  <div className="overlay"></div>
                  <div className="info">
                    <div className="sub"><i className="fas fa-map-pin"></i> Southern Province</div>
                    <h3>Galle</h3>
                  </div>
                </div>
                <div className="place-card-back">
                  <h3>🏰 Galle</h3>
                  <p>A Dutch colonial gem on the southern coast, Galle Fort is a UNESCO World Heritage site with charming cobblestone streets, boutique hotels, and stunning ocean views.</p>
                  <div className="tags"><span className="tag">UNESCO Fort</span><span className="tag">Colonial</span><span className="tag">Beaches</span></div>
                  <Link to="/destination/galle" className="card-btn">Explore <i className="fas fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
            {/* Nuwara Eliya */}
            <div className="place-card reveal delay-400">
              <div className="place-card-inner">
                <div className="place-card-front">
                  <img src="/assest/hulangala.jpeg" alt="Nuwara Eliya" />
                  <div className="overlay"></div>
                  <div className="info">
                    <div className="sub"><i className="fas fa-map-pin"></i> Central Province</div>
                    <h3>Nuwara Eliya</h3>
                  </div>
                </div>
                <div className="place-card-back">
                  <h3>🍃 Nuwara Eliya</h3>
                  <p>Known as "Little England," this highland retreat offers rolling tea plantations, cool misty weather, colonial bungalows, and breathtaking mountain scenery.</p>
                  <div className="tags"><span className="tag">Tea Country</span><span className="tag">Highland</span><span className="tag">Nature</span></div>
                  <Link to="/destination/nuwara-eliya" className="card-btn">Explore <i className="fas fa-arrow-right"></i></Link>
                </div>
              </div>
            </div>
          </div>

          {/* Other Places */}
          <div className="other-places reveal">
            <h3>More Destinations to Explore</h3>
            <div className="other-strip">
              <Link to="/explore#sigiriya" className="other-chip">🦁 Sigiriya</Link>
              <Link to="/explore#ella" className="other-chip">🌄 Ella</Link>
              <Link to="/explore#mirissa" className="other-chip">🐳 Mirissa</Link>
              <Link to="/explore#trincomalee" className="other-chip">🏖️ Trincomalee</Link>
              <Link to="/explore#anuradhapura" className="other-chip">🏛️ Anuradhapura</Link>
              <Link to="/explore#polonnaruwa" className="other-chip">🏰 Polonnaruwa</Link>
              <Link to="/explore#yala" className="other-chip">🐘 Yala</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item reveal delay-100">
              <div className="stat-icon"><i className="fas fa-globe-asia"></i></div>
              <div className="stat-num"><AnimatedCounter target={200} suffix="+" /></div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-item reveal delay-200">
              <div className="stat-icon"><i className="fas fa-users"></i></div>
              <div className="stat-num"><AnimatedCounter target={50} suffix="K+" /></div>
              <div className="stat-label">Happy Tourists</div>
            </div>
            <div className="stat-item reveal delay-300">
              <div className="stat-icon"><i className="fas fa-hotel"></i></div>
              <div className="stat-num"><AnimatedCounter target={500} suffix="+" /></div>
              <div className="stat-label">Partner Hotels</div>
            </div>
            <div className="stat-item reveal delay-400">
              <div className="stat-icon"><i className="fas fa-star"></i></div>
              <div className="stat-num"><AnimatedCounter target={98} suffix="%" /></div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="why-section" id="about">
        <div className="container">
          <div className="badge reveal">✦ Why Choose Us</div>
          <h2 className="section-title reveal">Travel with Confidence</h2>
          <div className="gold-divider reveal"></div>
          <div className="why-grid">
            <div className="why-card reveal delay-100">
              <div className="why-icon"><i className="fas fa-shield-alt"></i></div>
              <h4>Trusted & Secure</h4>
              <p>Your safety and security are our top priorities. All bookings are fully verified and covered by our travel guarantee.</p>
            </div>
            <div className="why-card reveal delay-200">
              <div className="why-icon"><i className="fas fa-tag"></i></div>
              <h4>Best Price Guarantee</h4>
              <p>We partner directly with hotels and tour operators to ensure you always get the most competitive prices available.</p>
            </div>
            <div className="why-card reveal delay-300">
              <div className="why-icon"><i className="fas fa-headset"></i></div>
              <h4>24/7 Support</h4>
              <p>Our dedicated team is available around the clock to assist you with anything during your Sri Lanka journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOUNDER SECTION ==================== */}
      <section className="founder-section" id="founder">
        <div className="container">
          <div className="founder-inner">
            <div className="founder-image-wrapper reveal-left">
              <div className="founder-gold-ring"></div>
              <img src="/assest/me.img.png" alt="Panduka Wijekoon - Founder" className="founder-img" />
              <div className="founder-badge">Founder & CEO</div>
            </div>
            <div className="founder-content reveal-right">
              <div className="badge">✦ Meet The Visionary</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>A Message from Our Founder</h2>
              <div className="gold-divider" style={{ textAlign: 'left', margin: '0 0 2rem' }}></div>
              <p className="founder-quote">"My vision for Ceylon Wonders was never just to build a travel platform. It was to create an exclusive gateway for the world to discover the raw, unfiltered, and deeply magical soul of Sri Lanka. We curate experiences that don't just show you the sights, but let you feel the beating heart of our island paradise."</p>
              <div className="founder-signature">
                <span className="founder-name">Panduka Wijekoon</span>
                <span className="founder-title">Founder, Ceylon Wonders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />

      {/* ==================== CTA BANNER ==================== */}
      <section className="cta-banner">
        <div className="container">
          <h2 className="reveal">
            Ready to Explore <span style={{ background: 'linear-gradient(135deg, #C9A84C, #F39C12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Sri Lanka?</span>
          </h2>
          <p className="reveal">Start planning your dream vacation today. Book hotels, explore destinations, and create unforgettable memories.</p>
          <div className="cta-actions reveal">
            <Link to="/booking" className="btn btn-primary"><i className="fas fa-hotel"></i> Book a Hotel</Link>
            <Link to="/signup" className="btn btn-outline"><i className="fas fa-user-plus"></i> Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
