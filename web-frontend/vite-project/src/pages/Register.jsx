// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register({ darkMode, setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); setMessageType("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    try {
      // Register
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Registration failed.");
      }

      setMessage("Registration successful! Logging in...");
      setMessageType("success");

      // Auto-login
      const loginResponse = await fetch("/api/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      const loginResult = await loginResponse.json();
      if (!loginResponse.ok) {
        throw new Error(loginResult.detail || "Auto-login failed.");
      }

      localStorage.setItem("token", loginResult.access_token);
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage(err.message);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Colors
  const primaryColor = darkMode ? "#0dcaf0" : "#0d6efd";
  const hoverColor   = darkMode ? "#0b5ed7" : "#0b5ed7";
  const activeColor  = darkMode ? "#0a58ca" : "#0a58ca";

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${darkMode ? 'text-light' : 'text-dark'}`}
      style={{ backgroundColor: 'transparent' }}
    >
      <motion.div className="rounded-4 shadow-lg p-4 p-md-5"
        style={{
          width: '100%',
          maxWidth: '450px',
          backdropFilter: 'blur(12px)',
          backgroundColor: darkMode ? 'rgba(30,30,30,0.7)' : 'rgba(255,255,255,0.7)',
          border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        
        <motion.h2 
          className="text-center mb-4" 
          style={{ color: darkMode ? '#0dcaf0' : '#0d6efd' }}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
        >
          Create Account
        </motion.h2>

        {message && (
          <motion.div 
            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`}
            style={{
              backdropFilter: 'blur(6px)',
              backgroundColor: messageType === "success"
                ? darkMode ? 'rgba(25,135,84,0.8)' : 'rgba(25,135,84,0.2)'
                : darkMode ? 'rgba(220,53,69,0.8)' : 'rgba(220,53,69,0.2)'
            }}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleRegister}>
          {["username","email","password","confirmPassword"].map((field,i) => (
            <motion.div 
              key={field} 
              className="mb-3"
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + 0.05*i }}
            >
              <label className="form-label">
                {field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase()+field.slice(1)}
              </label>
              <input
                type={["password","confirmPassword"].includes(field) ? "password" : (field === "email" ? "email":"text")}
                name={field}
                className={`form-control ${darkMode ? 'text-white' : ''}`}
                value={formData[field]}
                onChange={handleChange}
                required
                style={{
                  backdropFilter: 'blur(6px)',
                  backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
                  borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }}
              />
            </motion.div>
          ))}

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.55 }}
          >
            <button 
              type="submit" 
              className="btn w-100 fw-bold py-2" 
              disabled={isLoading}
              style={{ 
                background: darkMode ? '#0dcaf0' : '#0d6efd', 
                border: 'none', 
                color: 'white', 
                transition: 'all .3s ease',
                backdropFilter: 'blur(6px)'
              }}
              onMouseEnter={e=>e.target.style.background=darkMode ? '#0b5ed7' : '#0b5ed7'}
              onMouseLeave={e=>e.target.style.background=darkMode ? '#0dcaf0' : '#0d6efd'}
              onMouseDown={e=>e.target.style.background=darkMode ? '#0a58ca' : '#0a58ca'}
              onMouseUp={e=>e.target.style.background=darkMode ? '#0b5ed7' : '#0b5ed7'}
            >
              {isLoading ?
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"/>
                  Registering...
                </>
                : "Register Now"}
            </button>
          </motion.div>
        </form>

        <motion.div 
        className="mt-4 d-flex justify-content-center"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
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
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: darkMode ? '#0dcaf0' : '#0d6efd',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Sign in here
          </Link>
        </div>
      </motion.div>

      </motion.div>
    </div>
  );
}