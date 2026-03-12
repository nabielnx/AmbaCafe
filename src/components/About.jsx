import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './About.css';

/* ── image sets per gallery frame ── */
const frameSets = [
  // Frame 1 — large portrait (left)
  ['/gallery_bartender.png', '/hero_nature_cafe.png', '/coffee_atmosphere_forest.png'],
  // Frame 2 — small square (top-right)
  ['/pic1Home.jpg', '/menu_cappuccino.png', '/menu_latte.png'],
  // Frame 3 — small square (top-far-right)
  ['/gallery_corner.png', '/menu_pourover.png', '/menu_chemex.png'],
  // Frame 4 — wide landscape (bottom-right)
  ['/gallery_view.png', '/coffee_atmosphere_forest.png', '/product_shot_cappuccino.png'],
];

/* ── Swipeable Gallery Item ── */
const GalleryFrame = ({ images, index, motionDelay }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((dir) => {
    setDirection(dir);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  }, [images.length]);

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: motionDelay, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true, margin: '-50px' }}
      className={`gallery-item item-${index + 1}`}
    >
      {/* image layer */}
      <div className="gallery-img-wrapper">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={`${index}-${current}`}
            src={images[current]}
            alt={`NabsCafe atmosphere ${index + 1}`}
            loading="lazy"
            decoding="async"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
        <div className="gallery-overlay"></div>
      </div>

      {/* arrows — visible on hover */}
      <button className="gal-arrow gal-arrow-left" onClick={() => go(-1)} aria-label="Previous photo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <button className="gal-arrow gal-arrow-right" onClick={() => go(1)} aria-label="Next photo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
      </button>

      {/* dots */}
      <div className="gal-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`gal-dot${i === current ? ' active' : ''}`}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ── About Section ── */
const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-header text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="accent-text mb-4 block"
            style={{ color: 'var(--accent-leaf)' }}
          >
            OUR ATMOSPHERE
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Where Coffee <br /> Meets the <span className="italic" style={{ color: 'var(--accent-leaf)' }}>Wild</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="body-text mx-auto mt-6"
            style={{ maxWidth: '600px' }}
          >
          </motion.p>
        </div>

        {/* Bento Grid Gallery — swipeable frames */}
        <div className="gallery-grid">
          {frameSets.map((images, i) => (
            <GalleryFrame key={i} images={images} index={i} motionDelay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
