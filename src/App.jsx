import React from 'react';
import './App.css';
import NoiseTexture from './components/NoiseTexture';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import PhotoBooth from './components/PhotoBooth';
import Footer from './components/Footer';

// Image paths from the generated assets
const HERO_IMAGE = '/back1.jpg';

const ABOUT_IMAGES = [
  '/gallery_bartender.png',
  '/pic1Home.jpg',
  '/gallery_corner.png',
  '/coffee_atmosphere_forest.png',
  '/gallery_view.png',
];


function App() {
  return (
    <div className="app-container">
      <NoiseTexture />
      <Navbar />
      
      <main>
        <Hero heroImage={HERO_IMAGE} />
        <About aboutImages={ABOUT_IMAGES} />
        <Menu />
        <PhotoBooth />
        <Footer />
      </main>
    </div>
  );
}

export default App;
