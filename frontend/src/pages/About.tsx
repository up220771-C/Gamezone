// src/pages/About.tsx
import './About.css';
import { NavLink } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-container">
      <header className="about-hero">
        <h1>Welcome to Gamezone</h1>
        <p>Your ultimate destination for gaming adventures.</p>
      </header>

      <section className="about-section">
        <h2>Who we are?</h2>
        <p>
          At GameZone, we’re a team of gaming and tech enthusiasts united by the belief that digital entertainment brings people together worldwide. Our platform was born from the firsthand experience of players and developers who wanted a safe, intuitive space offering the best deals for your next virtual adventure. Every day, we strive to provide:
          A diverse catalogue featuring blockbuster titles and indie gems.
          Fast, 100% secure transactions.
          Expert customer support, ready to assist whenever you need it.
        </p>
      </section>

      <section className="about-section">
        <h2>Our mission</h2>
        <p>
          GameZone is committed to democratizing access to digital games, making them more accessible and affordable for everyone. We aim to:
          Innovate the purchasing experience with user‑friendly tools and personalized recommendations.
          Empower content creators by supporting both indie studios and major developers.
          Foster a respectful community where a passion for gaming is at the heart of every interaction.
          We believe gaming is more than a pastime—it’s a way to express creativity, build friendships, and explore new universes.
        </p>
      </section>

      <section className="about-section">
        <h2>Join our community</h2>
        <p>
          Becoming part of GameZone is simple and completely free. Once you sign up, you´ll be able to:
          Take part in exclusive events and weekly contests.
          Access themed forums to share reviews, guides, and tips.
          Enjoy special discounts and early access offers.
          Connect with fellow gamers who share your interests.
          Sign up today and dive into the ultimate gaming experience—see you at GameZone!
        </p>
      </section>

      <nav className="about-nav">
        <NavLink to="/" className="nav-button">
          Back to Home
        </NavLink>
      </nav>
    </div>
  );
}
