import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Split links: left of brand and right of brand
  const leftLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
  ];

  const rightLinks = [
    { name: 'Atmosphere', href: '#atmosphere' },
    { name: 'Contact', href: '#contact' },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] }
    }),
    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 glass-nav shadow-lg' : 'py-8 bg-transparent'}`}>
        <div className="container flex justify-between items-center">

          {/* Mobile: Spacer for centering */}
          <div className="md-hidden" style={{ width: 48 }}></div>

          {/* Desktop Left Links */}
          <div className="hidden md-flex items-center gap-8">
            {leftLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="text-xs uppercase tracking-ultra font-bold text-cream hover-gold"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Center Brand */}
          <motion.a
            href="#home"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer"
            style={{ textDecoration: 'none' }}
          >
            <span className="font-bold tracking-widest text-cream" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}>AMBACAFE</span>
          </motion.a>

          {/* Desktop Right Links */}
          <div className="hidden md-flex items-center gap-8">
            {rightLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 3) * 0.08 }}
                className="text-xs uppercase tracking-ultra font-bold text-cream hover-gold"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md-hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-transparent border-none text-cream pointer relative z-50"
              aria-label="Toggle navigation menu"
              style={{ minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>


      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mobile-menu-overlay"
          >
            {/* Decorative watermark */}
            <div className="menu-watermark" aria-hidden="true">AMBA</div>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="menu-accent-line"
            />

            <div className="mobile-menu-content">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="menu-label"
              ></motion.span>

              <nav className="mobile-nav-links">
                {allLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-nav-link"
                  >
                    <span className="link-text">{link.name}</span>
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mobile-menu-footer"
              >
                <p className="mobile-menu-tagline">Nature's Perfect Brew</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
