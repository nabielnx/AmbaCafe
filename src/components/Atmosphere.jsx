import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Atmosphere = ({ atmosphereImage }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Only use parallax on desktop — saves per-frame repaints on mobile
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const items = [
    { title: 'Morning Mist', desc: 'The perfect time for a quiet reflection with our signature brew.' },
    { title: 'Forest Canopy', desc: 'Find shade and serenity under our living botanical ceiling.' },
    { title: 'Artisan Soul', desc: 'Every detail crafted to reconnect you with the natural world.' }
  ];

  return (
    <section id="atmosphere" className="full-bleed relative overflow-hidden flex items-center justify-center" style={{ minHeight: isMobile ? '80vh' : '110vh' }}>
      {/* Parallax Background — static on mobile */}
      {isMobile ? (
        <div className="absolute inset-0 z-0">
          <img
            src={atmosphereImage}
            alt="Cafe atmosphere"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.55)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--forest-dark), transparent 30%, transparent 70%, var(--forest-dark))' }}></div>
        </div>
      ) : (
        <motion.div style={{ y }} className="absolute inset-0 z-0" >
          <div
            className="w-full"
            style={{
              height: '140%',
              backgroundImage: `url(${atmosphereImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.55)',
              willChange: 'transform'
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, var(--forest-dark), transparent 25%, transparent 75%, var(--forest-dark))' }}></div>
        </motion.div>
      )}

      {/* Floating Content Cards */}
      <div className="relative z-10 container grid md-grid-3 gap-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            viewport={{ once: true }}
            className="atmosphere-card"
          >
            <h4 className="text-2xl italic mb-4 text-gold" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h4>
            <div className="divider-small"></div>
            <p className="card-text">"{item.desc}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Atmosphere;
