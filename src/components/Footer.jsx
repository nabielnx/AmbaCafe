import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" style={{ paddingTop: '6rem', paddingBottom: '3rem', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <div className="grid lg-grid-4" style={{ gap: '3rem', marginBottom: '4rem' }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="brand-logo">N</div>
              <span className="text-3xl font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-heading)' }}>AMBACAFE</span>
            </div>
            <p className="footer-text">
              "Crafting a sanctuary where every cup tells the story of the forest and the passion of the artisan."
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                <a key={idx} href="#" className="social-link" aria-label={`Follow us on ${Icon.displayName || 'social media'}`}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="cat-header mb-8 italic">Navigation</h4>
            <ul className="footer-links">
              <li><a href="#home">The Beginning</a></li>
              <li><a href="#about">Our Roots</a></li>
              <li><a href="#menu">The Brews</a></li>
              <li><a href="#atmosphere">The Sanctuary</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="cat-header mb-8 italic">Visit Us</h4>
            <ul className="footer-links">
              <li className="flex items-start gap-4">
                <MapPin className="icon-gold" size={18} />
                <span>123 Botanical Lane,<br />Green Valley, GV 4501</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="icon-gold" size={18} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="icon-gold" size={18} />
                <span>hello@nabscafe.nature</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© 2024 NABSCAFE BOTANICAL BREWS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a href="#" className="legal">Privacy Policy</a>
            <a href="#" className="legal">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
