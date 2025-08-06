// src/pages/About.tsx
import { NavLink } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="particles-background">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            '--size': `${Math.random() * 8 + 2}px`,
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--delay': `${Math.random() * 5}s`,
            '--duration': `${Math.random() * 10 + 10}s`,
          } as React.CSSProperties}></div>
        ))}
      </div>
      
      <header className="about-hero">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">Gamezone</span></h1>
          <p>Your ultimate destination for gaming adventures</p>
          <div className="hero-icons">
            <div className="icon-circle">
              <i className="fas fa-gamepad"></i>
            </div>
            <div className="icon-circle">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="icon-circle">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
      </header>

      <section className="about-section">
        <div className="section-header">
          <div className="section-icon">
            <i className="fas fa-users"></i>
          </div>
          <h2>Who we are?</h2>
        </div>
        <div className="section-content">
          <p>
            At GameZone, we're a team of gaming and tech enthusiasts united by the belief that digital entertainment brings people together worldwide. Our platform was born from the firsthand experience of players and developers who wanted a safe, intuitive space offering the best deals for your next virtual adventure.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-gem"></i>
              <h3>Diverse Catalogue</h3>
              <p>Blockbuster titles and indie gems</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Secure Transactions</h3>
              <p>Fast, 100% secure payments</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-headset"></i>
              <h3>Expert Support</h3>
              <p>Ready to assist whenever you need</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <div className="section-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <h2>Our mission</h2>
        </div>
        <div className="section-content">
          <p>
            GameZone is committed to democratizing access to digital games, making them more accessible and affordable for everyone. We believe gaming is more than a pastime—it's a way to express creativity, build friendships, and explore new universes.
          </p>
          <div className="mission-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Innovate the Experience</h3>
                <p>User-friendly tools and personalized recommendations</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Empower Creators</h3>
                <p>Supporting both indie studios and major developers</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Foster Community</h3>
                <p>A respectful space where passion for gaming thrives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <div className="section-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h2>Join our community</h2>
        </div>
        <div className="section-content">
          <p>
            Becoming part of GameZone is simple and completely free. Once you sign up, you'll be able to:
          </p>
          <div className="community-benefits">
            <div className="benefit">
              <i className="fas fa-calendar-star"></i>
              <span>Exclusive events and weekly contests</span>
            </div>
            <div className="benefit">
              <i className="fas fa-forumbee"></i>
              <span>Themed forums for reviews and guides</span>
            </div>
            <div className="benefit">
              <i className="fas fa-tags"></i>
              <span>Special discounts and early access</span>
            </div>
            <div className="benefit">
              <i className="fas fa-handshake"></i>
              <span>Connect with fellow gamers</span>
            </div>
          </div>
          <div className="cta-box">
            <p>Sign up today and dive into the ultimate gaming experience!</p>
            <NavLink to="/signup" className="cta-button">
              Join Now <i className="fas fa-arrow-right"></i>
            </NavLink>
          </div>
        </div>
      </section>

      <div className="about-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-gamepad"></i>
            <span>Gamezone</span>
          </div>
          <p>Your portal to endless gaming adventures</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-discord"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </div>
  );
}