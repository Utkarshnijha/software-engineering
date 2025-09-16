// src/components/Background.jsx
import { motion } from "framer-motion";
import bgImage from '../assets/titanics-bg.jpg';
import { useMemo } from 'react';

export default function Background({ darkMode }) {
  const backgroundStyles = useMemo(() => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: -1000, // Very low z-index to ensure it stays behind everything
    pointerEvents: 'none',
    isolation: 'isolate' // Creates a new stacking context
  }), []);

  return (
    <div 
      className="background-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1000,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Main background image with dynamic darkening */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          ...backgroundStyles,
          backgroundImage: `url(${bgImage})`,
          filter: `
            blur(8px)
            ${darkMode ? 'brightness(0.4) contrast(1.1)' : 'brightness(0.9) contrast(1.05)'}
          `,
          transform: 'scale(1.05)',
          willChange: 'transform',
        }}
      />

      {/* Dynamic color overlay with stronger dark mode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          ...backgroundStyles,
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(5, 5, 15, 0.85) 0%, rgba(20, 20, 40, 0.75) 100%)' 
            : 'linear-gradient(135deg, rgba(240, 240, 255, 0.5) 0%, rgba(220, 220, 240, 0.3) 100%)',
          zIndex: -999,
          mixBlendMode: darkMode ? 'multiply' : 'screen'
        }}
      />

      {/* Subtle texture - less visible in dark mode */}
      <div
        style={{
          ...backgroundStyles,
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${darkMode ? '0.05' : '0.04'}'/%3E%3C/svg%3E")
          `,
          zIndex: -998,
        }}
      />
    </div>
  );
}