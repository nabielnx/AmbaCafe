import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Menu.css';

const menuData = {
  Signature: [
    { name: 'Forest Velvet Latte', price: '$6.50', desc: 'Oak-smoked syrup, double espresso, and silky oat milk.', img: '/menu_latte.png' },
    { name: 'Amber Glow Cappuccino', price: '$5.50', desc: 'Classic brew with a hint of wild honey.', img: '/menu_cappuccino.png' },
    { name: 'Midnight Espresso Tonic', price: '$7.00', desc: 'Double shot over chilled tonic water with a citrus twist.', img: '/menu_espresso_tonic.png' },
  ],
  'Hand-Brew': [
    { name: 'Misty Peak Pour-over', price: '$7.00', desc: 'Single origin beans from volcanic soil with citrus notes.', img: '/menu_pourover.png' },
    { name: 'Sunrise Chemex', price: '$7.50', desc: 'Light roast Ethiopian natural, bloomed to perfection.', img: '/menu_chemex.png' },
    { name: 'Heritage Siphon', price: '$8.00', desc: 'Full-bodied Colombian, brewed at the table.', img: '/menu_siphon.png' },
  ],
  'Botanical Teas': [
    { name: 'Pine Needle Matcha', price: '$6.00', desc: 'Ceremonial grade matcha infused with a touch of pine.', img: '/menu_matcha.png' },
    { name: 'Wildflower Chamomile', price: '$5.00', desc: 'Sun-dried chamomile with hints of lavender and honey.', img: '/menu_chamomile.png' },
    { name: 'Smoky Oolong Reserve', price: '$5.50', desc: 'Aged high-mountain oolong with a delicate charred finish.', img: '/menu_oolong.png' },
  ],
  Pastries: [
    { name: 'Honey Oak Croissant', price: '$4.50', desc: 'Layered butter croissant glazed with wildflower honey.', img: '/menu_croissant.png' },
    { name: 'Forest Berry Tart', price: '$5.00', desc: 'Seasonal berries on almond cream in a crisp shell.', img: '/menu_tart.png' },
    { name: 'Matcha Financier', price: '$4.00', desc: 'Delicate French almond cake with ceremonial matcha.', img: '/menu_financier.png' },
  ],
};

const categories = Object.keys(menuData);

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section id="menu" className="menu-section bg-forest">
      <div className="container">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="accent-text mb-4 block"
          >
            CURATED SELECTION
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Botanical <span className="italic text-gold">Brews</span>
          </motion.h2>
        </div>

        {/* Open Book */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
          className="open-book"
        >
          {/* Book Spine / Center Binding */}
          <div className="book-binding" aria-hidden="true" />

          {/* Left Page — Category Tabs */}
          <div className="book-page page-left">
            <div className="page-texture" aria-hidden="true" />
            <div className="page-left-inner">
              <div className="page-left-header">
                <span className="page-brand-est">EST. 2024</span>
                <h3 className="page-brand-name">AMBACAFE</h3>
                <div className="page-brand-divider">
                  <span className="brand-line" />
                  <span className="brand-diamond">◆</span>
                  <span className="brand-line" />
                </div>
                <p className="page-brand-sub">Our Menu</p>
              </div>

              <nav className="cat-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-tab ${activeCategory === cat ? 'cat-tab-active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </nav>

              <p className="page-left-footer">Nature's Perfect Brew</p>
            </div>
          </div>

          {/* Right Page — Menu Items */}
          <div className="book-page page-right">
            <div className="page-texture" aria-hidden="true" />
            <div className="page-right-inner">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  className="page-right-content"
                >
                  <div className="page-right-header">
                    <span className="page-cat-line" />
                    <h3 className="page-cat-title">{activeCategory}</h3>
                    <span className="page-cat-line" />
                  </div>

                  <div className="menu-items-list">
                    {menuData[activeCategory].map((item, i) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="menu-book-item"
                      >
                        <div className="menu-book-img-wrap">
                          <img src={item.img} alt={item.name} loading="lazy" decoding="async" className="menu-book-img" />
                        </div>
                        <div className="menu-book-info">
                          <div className="menu-book-item-row">
                            <span className="menu-book-name">{item.name}</span>
                            <span className="menu-book-dots" />
                            <span className="menu-book-price">{item.price}</span>
                          </div>
                          <p className="menu-book-desc">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="page-right-footer">
                    <span className="footer-dec-line" />
                    <span className="footer-dec-leaf">☘</span>
                    <span className="footer-dec-line" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Menu;
