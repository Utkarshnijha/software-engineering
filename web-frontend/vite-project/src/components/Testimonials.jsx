// src/pages/Testimonials.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  "“Clean design, intuitive flow, and surprisingly fun to test different passenger scenarios. This tool makes history interactive!” – Love",
  "“Clean UI and great predictions!” – Sonali",
  "“It's the perfect blend of education and interactivity. The interface is modern and easy to use” – Erbakan",
  "“From the animated inputs to the smooth transitions, this survival calculator is a UI gem. It's like time travel with a modern twist” – Jamal",
  "“I appreciate the thoughtful layout and responsive design. Everything just works, even on mobile. Love it!” – Marlis",
  "“Who knew predicting Titanic survival could be this addictive? Beautiful interface, fast results, and a fun way to learn about history and data!” – Ahtisham",
  "“It's like a mini time capsule with a tech upgrade. The interface is smooth, colors are soothing, and the experience is just awesome” – Utkarshni",
];

const Testimonials = ({ darkMode }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        setVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`py-5 ${darkMode ? 'text-light' : 'text-dark'}`}>
      <div className="container">
        <motion.div
          className="p-4 p-md-5 mx-auto"
          style={{
            maxWidth: '800px',
            backdropFilter: 'blur(16px)',
            backgroundColor: darkMode
              ? 'rgba(30, 30, 30, 0.3)'
              : 'rgba(255, 255, 255, 0.2)',
            border: darkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '2rem',
            boxShadow: darkMode
              ? '0 8px 24px rgba(255, 255, 255, 0.05)'
              : '0 8px 24px rgba(0, 0, 0, 0.1)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className={`text-center mb-4 ${darkMode ? 'text-info' : 'text-primary'}`}
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            What Users Say
          </motion.h2>

          <div className="position-relative" style={{ minHeight: '150px' }}>
            <AnimatePresence mode="wait">
              {visible && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="p-4"
                  style={{
                    backdropFilter: 'blur(8px)',
                    backgroundColor: darkMode
                      ? 'rgba(50, 50, 50, 0.25)'
                      : 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '1.5rem',
                    border: darkMode
                      ? '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <blockquote className="mb-0 fs-5 fst-italic">
                    {testimonials[index]}
                  </blockquote>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="d-flex justify-content-center mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setVisible(false);
                  setTimeout(() => {
                    setIndex(i);
                    setVisible(true);
                  }, 200);
                }}
                className={`btn btn-sm mx-1 rounded-pill ${index === i
                  ? (darkMode ? 'btn-info' : 'btn-primary')
                  : (darkMode ? 'bg-secondary' : 'bg-light')}`}
                style={{
                  width: '12px',
                  height: '12px',
                  padding: 0,
                  border: 'none',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Testimonials;
