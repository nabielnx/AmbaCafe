import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './Hero.css';

const Hero = ({ heroImage }) => {
  return (
    <section id="home" className="full-bleed relative flex items-center justify-center overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Background Image — using <img> for better browser optimization */}
      <img
        src={heroImage}
        alt="NabsCafe nature-themed interior"
        className="hero-bg"
        fetchpriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 hero-overlay"></div>

      {/* Content */}
      <div className="relative z-10 text-center container">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="accent-text mb-4 block animate-float" style={{ color: 'var(--sandstone-cream)' }}>ESTABLISHED 2024</span>
          <h1 className="section-title mb-8">
            Nature's <br />
            <span className="italic text-gold">Perfect Brew</span>
          </h1>

          <div className="hero-cta-group">
            <a href="#menu" className="hero-cta-link">
              Explore the Collection
            </a>
            <span className="hero-cta-sep">·</span>
            <a href="#about" className="hero-cta-link hero-cta-secondary">
              Watch Our Story
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="hero-book-wrapper"
          >
            <span className="hero-book-line" aria-hidden="true"></span>
            <a href="#contact" className="hero-book-btn">
              <span className="hero-book-label">Reserve Your Experience</span>
              <span className="hero-book-sub">Book a Table</span>
            </a>
            <span className="hero-book-line" aria-hidden="true"></span>
          </motion.div>

          </motion.div>
      </div>

      {/* Scroll Indicator — hidden on mobile for cleaner UX */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="scroll-indicator hidden md-block"
      >
        <ChevronDown size={36} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

export default Hero;
