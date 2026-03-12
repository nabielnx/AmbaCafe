import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Download, RotateCcw, Sparkles, Film, Heart } from 'lucide-react';
import './PhotoBooth.css';

/* ── Photo Booth Themes ── */
const THEMES = [
  {
    id: 'vintage',
    name: 'Vintage Film',
    icon: <Film size={18} />,
    bgColor: '#111111',
    borderColor: '#ffffff',
    textColor: '#c5a059',
    font: 'serif',
    label: 'NabsCafe — EST. 2024',
    padding: 30
  },
  {
    id: 'matcha',
    name: 'Matcha & Gold',
    icon: <Sparkles size={18} />,
    bgColor: '#1a2f23',
    borderColor: '#c5a059',
    textColor: '#f4efe6',
    font: 'serif',
    label: 'N A B S C A F E',
    padding: 24
  },
  {
    id: 'cream',
    name: 'Cream Canvas',
    icon: <Heart size={18} />,
    bgColor: '#f4efe6',
    borderColor: '#0f172a',
    textColor: '#0f172a',
    font: 'sans-serif',
    label: 'MEMORIES',
    padding: 24
  }
];

const PhotoBooth = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  
  // State for the 3-photo sequence
  const [photos, setPhotos] = useState([]); // array of base64 strings
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [capturingIndex, setCapturingIndex] = useState(-1); // 0, 1, 2
  const [countdown, setCountdown] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  
  const [finalStripUrl, setFinalStripUrl] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  /* ── 3-Photo Capture Sequence ── */
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const startSession = async () => {
    if (!webcamRef.current) return;
    
    setIsSessionActive(true);
    setPhotos([]);
    setFinalStripUrl(null);
    
    const newPhotos = [];

    // Capture 3 photos in a loop
    for (let i = 0; i < 3; i++) {
      setCapturingIndex(i);
      
      // 3-second countdown
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await delay(1000);
      }
      
      setCountdown(null);
      
      // Flash effect
      setShowFlash(true);
      
      // Capture frame
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        newPhotos.push(imageSrc);
        setPhotos([...newPhotos]); // update state for UI
      }
      
      setTimeout(() => setShowFlash(false), 150);
      
      // Brief pause before next countdown (unless it's the last photo)
      if (i < 2) await delay(1000);
    }
    
    setCapturingIndex(-1);
    setIsSessionActive(false);
    
    // Auto-generate the final strip once 3 photos are taken
    if (newPhotos.length === 3) {
      generatePhotoStrip(newPhotos);
    }
  };

  /* ── Canvas Rendering for the 3-Strip ── */
  const generatePhotoStrip = async (imageB64s) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const theme = selectedTheme;
    
    // Load all 3 images to get dimensions
    const loadedImages = await Promise.all(
      imageB64s.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );
    
    if (loadedImages.length === 0) return;

    // Use the first image to define the aspect ratio
    const imgW = loadedImages[0].width;
    const imgH = loadedImages[0].height;
    
    // Strip layout calculations
    const padding = theme.padding * (imgW / 400); // Scale padding relative to image resolution (assume 400px baseline preview)
    const spacing = theme.id === 'vintage' ? padding * 0.5 : padding; // Space between photos
    
    // Header space (top margin), Footer space (bottom margin for text)
    const headerHeight = padding * 1.5;
    const footerHeight = padding * 4.5;
    
    // Total Canvas Dimensions
    // Width = left pad + image width + right pad
    // Height = top pad + (3 * img height) + (2 * spacing) + footer height
    canvas.width = imgW + (padding * 2);
    canvas.height = headerHeight + (imgH * 3) + (spacing * 2) + footerHeight;
    
    // Draw Background
    ctx.fillStyle = theme.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // --- Custom Theme Backgrounds & Borders ---
    if (theme.id === 'vintage') {
      // Draw Sprocket Holes
      ctx.fillStyle = '#dddddd';
      const holeW = padding * 0.3;
      const holeH = padding * 0.45;
      const holeSpacing = padding * 0.85;
      const totalHoles = Math.floor(canvas.height / holeSpacing);
      
      const drawHole = (x, y) => {
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, holeW, holeH, holeW * 0.2);
        } else {
          ctx.rect(x, y, holeW, holeH); // fallback
        }
        ctx.fill();
      };
      
      for (let i = 0; i < totalHoles; i++) {
        const yPos = (i * holeSpacing) + (holeSpacing / 2);
        drawHole(padding * 0.35, yPos); // Left side
        drawHole(canvas.width - padding * 0.35 - holeW, yPos); // Right side
      }
    } 
    else if (theme.id === 'matcha') {
      // Inner double border
      const innerGap = padding * 0.4;
      ctx.strokeStyle = theme.borderColor;
      ctx.lineWidth = padding * 0.05;
      ctx.strokeRect(innerGap, innerGap, canvas.width - innerGap*2, canvas.height - innerGap*2);
      ctx.strokeRect(innerGap*1.5, innerGap*1.5, canvas.width - innerGap*3, canvas.height - innerGap*3);
    }

    // Draw the 3 Images
    loadedImages.forEach((img, index) => {
      const yPos = headerHeight + (index * (imgH + spacing));
      
      // Theme-specific pre-image effects
      if (theme.id === 'cream') {
        ctx.save();
        ctx.fillStyle = '#e5ddd0'; // drop shadow color
        ctx.fillRect(padding + (padding * 0.2), yPos + (padding * 0.2), imgW, imgH);
        ctx.restore();
      }
      
      // Draw image (Mirrored horizontally to match live preview)
      ctx.save();
      ctx.translate(padding + imgW, yPos);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, imgW, imgH);
      ctx.restore();
      
      // Theme-specific post-image borders
      if (theme.id === 'vintage') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(padding - 1, yPos - 1, imgW + 2, imgH + 2);
      }
      else if (theme.id === 'matcha') {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = padding * 0.1;
        ctx.strokeRect(padding, yPos, imgW, imgH);
      }
    });
    
    // Draw Footer Text
    ctx.fillStyle = theme.textColor;
    
    if (theme.id === 'vintage') {
      ctx.font = `italic ${Math.round(padding * 1.0)}px "${theme.font}", serif`;
      ctx.textAlign = 'center';
      ctx.fillText(theme.label, canvas.width / 2, canvas.height - (padding * 2.0));
      
      // Add date for vintage
      ctx.font = `${Math.round(padding * 0.6)}px sans-serif`;
      ctx.fillStyle = '#999999';
      ctx.fillText(new Date().toLocaleDateString().replace(/\//g, '.'), canvas.width / 2, canvas.height - (padding * 1.0));
    } 
    else if (theme.id === 'matcha') {
      ctx.font = `bold ${Math.round(padding * 0.9)}px "${theme.font}", serif`;
      ctx.textAlign = 'center';
      if(ctx.letterSpacing !== undefined) ctx.letterSpacing = '8px';
      ctx.fillText(theme.label, canvas.width / 2, canvas.height - (padding * 1.9));
      
      if(ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
      ctx.font = `italic ${Math.round(padding * 0.55)}px "${theme.font}", serif`;
      ctx.fillText("PREMIUM EXPERIENCE", canvas.width / 2, canvas.height - (padding * 0.9));
    }
    else if (theme.id === 'cream') {
      ctx.font = `bold ${Math.round(padding * 1.1)}px "${theme.font}", sans-serif`;
      ctx.textAlign = 'center';
      if(ctx.letterSpacing !== undefined) ctx.letterSpacing = '6px';
      ctx.fillText(theme.label, canvas.width / 2, canvas.height - (padding * 1.8));
      
      // Fake Barcode
      const bcHeight = padding * 0.5;
      const bcX = (canvas.width / 2) - (padding * 3);
      const bcY = canvas.height - (padding * 1.0);
      
      ctx.fillStyle = theme.textColor;
      const lineWeights = [1, 2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2];
      let currentX = bcX;
      for(let w of lineWeights) {
         ctx.fillRect(currentX, bcY, w * (imgW/400) * 1.5, bcHeight);
         currentX += (w + 1.2) * (imgW/400) * 2;
      }
    }
    
    // Export as Blob URL instead of huge base64 string
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setFinalStripUrl(url);
    }, 'image/jpeg', 0.95);
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (finalStripUrl) {
        URL.revokeObjectURL(finalStripUrl);
      }
    };
  }, [finalStripUrl]);

  /* ── Download logic ── */
  const handleDownload = () => {
    if (!finalStripUrl) return;
    const a = document.createElement('a');
    a.href = finalStripUrl;
    a.download = `nabscafe-photostrip-${Date.now()}.jpg`;
    a.click();
  };
  
  const handleRetake = () => {
    setPhotos([]);
    if (finalStripUrl) {
      URL.revokeObjectURL(finalStripUrl);
    }
    setFinalStripUrl(null);
  };

  return (
    <section id="atmosphere" className="pb-section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="accent-text mb-4 block"
          >
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            AMBACAFE <span className="italic text-gold">Photo Booth</span>
          </motion.h2>
          <p className="body-text mx-auto mt-4" style={{ opacity: 0.7, maxWidth: '500px' }}>
            Bring home a memory. Select a theme, strike 3 poses, and get your digital photo strip.
          </p>
        </div>

        {/* Main Interface Layout */}
        <div className="pb-container">
          
          {/* LEFT: Live Camera & Controls */}
          <div className="pb-camera-col">
            <div className="pb-viewfinder-glass">
              {/* Status Indicator */}
              <div className="pb-status-bar">
                {isSessionActive ? (
                  <span className="pb-status-active">
                    <span className="pb-dot pb-dot-pulse"></span> 
                    Capturing {capturingIndex + 1} of 3
                  </span>
                ) : (
                  <span className="pb-status-idle">
                    <span className="pb-dot"></span> Camera Ready
                  </span>
                )}
              </div>

              <div className="pb-viewfinder">
                {isCameraStarted ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    onUserMedia={() => setIsCameraReady(true)}
                    className="pb-webcam"
                  />
                ) : (
                  <div className="pb-camera-prompt">
                    <Camera size={48} opacity={0.5} style={{ marginBottom: '1rem' }} />
                    <button 
                      className="pb-start-camera-btn"
                      onClick={() => setIsCameraStarted(true)}
                    >
                      Start Camera Access
                    </button>
                    <p className="pb-camera-desc">Allow camera access to start your photo booth session</p>
                  </div>
                )}

                {/* Camera Flash Effect */}
                <AnimatePresence>
                  {showFlash && (
                    <motion.div
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      className="pb-flash"
                    />
                  )}
                </AnimatePresence>

                {/* Countdown Overlay */}
                <AnimatePresence>
                  {countdown !== null && (
                    <motion.div 
                      key={countdown}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                      className="pb-countdown"
                    >
                      {countdown}
                    </motion.div>
                  )}
                </AnimatePresence>

                {isCameraStarted && !isCameraReady && (
                  <div className="pb-camera-loading">
                    <span className="aipb-spinner" style={{ marginBottom: '1rem' }} />
                    <p>Accessing Camera...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            {!isSessionActive && !finalStripUrl && (
              <div className="pb-controls">
                <div className="pb-theme-selector">
                  <h4 className="pb-control-label">Choose Strip Theme</h4>
                  <div className="pb-theme-buttons">
                    {THEMES.map(theme => (
                      <button
                        key={theme.id}
                        className={`pb-theme-btn ${selectedTheme.id === theme.id ? 'active' : ''}`}
                        onClick={() => setSelectedTheme(theme)}
                      >
                        {theme.icon}
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  className="pb-capture-btn"
                  onClick={startSession}
                  disabled={!isCameraStarted || !isCameraReady}
                >
                  <div className="pb-capture-inner">
                    <Camera size={26} style={{ marginRight: '8px' }} />
                    Start Session
                  </div>
                </button>
              </div>
            )}
            
            {/* Session Active Actions */}
            {isSessionActive && (
              <div className="pb-controls">
                 <p className="pb-active-hint">Get ready for the next shot!</p>
              </div>
            )}

            {/* Post-Session Actions */}
            {finalStripUrl && (
              <div className="pb-controls">
                <div className="pb-result-actions">
                  <button className="pb-action-btn pb-btn-secondary" onClick={handleRetake}>
                    <RotateCcw size={18} /> Retake Strip
                  </button>
                  <button className="pb-action-btn pb-btn-primary" onClick={handleDownload}>
                    <Download size={18} /> Download Strip
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Photo Strip Preview */}
          <div className="pb-preview-col">
            <div className="pb-strip-container">
              {finalStripUrl ? (
                /* Final Merged Strip */
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pb-final-strip-wrap"
                >
                  <img src={finalStripUrl} alt="Your Photo Strip" className="pb-final-strip" />
                </motion.div>
              ) : (
                /* Live Build-up Preview */
                <div 
                  className={`pb-strip-build pb-theme-${selectedTheme.id}`}
                  style={{ 
                    backgroundColor: selectedTheme.bgColor,
                    color: selectedTheme.textColor,
                    padding: `${selectedTheme.padding/2}px`,
                    gap: selectedTheme.id === 'vintage' ? '8px' : '15px'
                  }}
                >
                  <div className="pb-strip-slots" style={{ gap: selectedTheme.id === 'vintage' ? '8px' : '15px' }}>
                    {[0, 1, 2].map((idx) => (
                      <div 
                        key={idx} 
                        className="pb-slot"
                      >
                        {photos[idx] ? (
                          <img src={photos[idx]} alt={`Shot ${idx+1}`} className="pb-slot-img" />
                        ) : (
                          <div className="pb-slot-empty">
                            <Camera size={20} opacity={0.3} color={selectedTheme.textColor} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pb-strip-footer" style={{ 
                    fontFamily: selectedTheme.font === 'serif' ? 'var(--font-heading)' : 'sans-serif' 
                  }}>
                    {selectedTheme.label}
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Hidden Canvas for Rendering */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

      </div>
    </section>
  );
};

export default PhotoBooth;
