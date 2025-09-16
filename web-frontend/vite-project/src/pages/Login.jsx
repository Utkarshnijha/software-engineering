// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login({ darkMode, setIsAuthenticated }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage]     = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const primaryColor = darkMode ? "#0dcaf0" : "#0d6efd";
  const hoverColor   = darkMode ? "#0b5ed7" : "#0b5ed7";
  const activeColor  = darkMode ? "#0a58ca" : "#0a58ca";

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (!response.ok) {
        let err = "Login failed";
        const ct = response.headers.get("Content-Type") || "";
        if (ct.includes("application/json")) {
          const { detail } = await response.json();
          err = detail || err;
        } else {
          err = await response.text() || err;
        }
        throw new Error(err);
      }

      const { access_token } = await response.json();
      localStorage.setItem("token", access_token);
      setMessage("✅ Login successful!");
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${darkMode ? 'text-light' : 'text-dark'}`}
      style={{ backgroundColor: 'transparent' }}
    >
      <motion.div
        className="rounded-4 shadow-lg p-4 p-md-5"
        style={{
          width: '100%',
          maxWidth: '450px',
          backdropFilter: 'blur(12px)',
          backgroundColor: darkMode ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.7)',
          border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* [Rest of the component remains exactly the same] */}
        <motion.h2 
          className="text-center mb-4"
          style={{ color: darkMode ? '#0dcaf0' : '#0d6efd' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back
        </motion.h2>

        {message && (
          <motion.div
            className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"} ${darkMode ? "text-white" : ""}`}
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              backdropFilter: 'blur(6px)',
              backgroundColor: message.includes("✅") 
                ? darkMode ? 'rgba(25,135,84,0.8)' : 'rgba(25,135,84,0.2)'
                : darkMode ? 'rgba(220,53,69,0.8)' : 'rgba(220,53,69,0.2)'
            }}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleLogin}>
          <motion.div className="mb-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-control ${darkMode ? 'text-white' : ''}`}
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                backdropFilter: 'blur(6px)',
                backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
              }}
            />
          </motion.div>

          <motion.div className="mb-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${darkMode ? 'text-white' : ''}`}
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                backdropFilter: 'blur(6px)',
                backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
              }}
            />
          </motion.div>

          <motion.div className="mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <button
              type="submit"
              className="btn w-100 fw-bold py-2"
              disabled={isLoading}
              style={{
                background: darkMode ? '#0dcaf0' : '#0d6efd',
                border: 'none',
                color: 'white',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                backdropFilter: 'blur(6px)'
              }}
              onMouseEnter={e => (e.target.style.background = darkMode ? '#0b5ed7' : '#0b5ed7')}
              onMouseLeave={e => (e.target.style.background = darkMode ? '#0dcaf0' : '#0d6efd')}
              onMouseDown={e => (e.target.style.background = darkMode ? '#0a58ca' : '#0a58ca')}
              onMouseUp={e => (e.target.style.background = darkMode ? '#0b5ed7' : '#0b5ed7')}
            >
              {isLoading
                ? <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Signing In...
                  </>
                : "Login to Your Account"}
            </button>
          </motion.div>
        </form>

      <motion.div 
        className="mt-4 d-flex justify-content-center"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.7 }}
      >
        <div
          className="px-3 py-2 rounded-pill text-center shadow-sm"
          style={{
            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            backdropFilter: 'blur(6px)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
            color: darkMode ? '#fff' : '#000',
            fontSize: '0.9rem'
          }}
        >
          Don't have an account?{" "}
          <Link 
            to="/register" 
            style={{ 
              color: darkMode ? '#0dcaf0' : '#0d6efd',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Create one
          </Link>
        </div>
      </motion.div>


      </motion.div>
    </div>
  );
}