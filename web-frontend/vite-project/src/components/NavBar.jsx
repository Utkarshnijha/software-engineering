// src/components/NavBar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import lightLogo from '../assets/logo-256-B.png';
import darkLogo  from '../assets/logo-256.png';

export default function NavBar({
  darkMode,
  setDarkMode,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const navigate = useNavigate();

  /* ─── logout: clear token + history ─────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem('token');      // existing
    localStorage.removeItem('history');    // ← wipes saved predictions
    setIsAuthenticated(false);
    navigate('/login');
  };

  /* ─── decode token to check admin status ────────────────────── */
  let isAdmin = false;
  if (isAuthenticated) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        isAdmin = decoded.sub === 'admin@titanic.com';
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
  }

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'
      } border-bottom mb-4`}
    >
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={darkMode ? darkLogo : lightLogo}
            alt="Titanic AI Logo"
            width="40"
            height="40"
            className="me-2"
          />
          Titanic AI
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* left-side nav links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/calculator"
                className={({ isActive }) =>
                  `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                }
              >
                Calculator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/ad"
                className={({ isActive }) =>
                  `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                }
              >
                Ad Page
              </NavLink>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                  }
                >
                  History
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* right-side buttons */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `nav-link mx-2 ${isActive ? 'active fw-bold' : ''}`
                  }
                >
                  Register
                </NavLink>
              </>
            )}

            <button
              className={`btn btn-sm ${
                darkMode ? 'btn-outline-light' : 'btn-outline-dark'
              }`}
              onClick={() => setDarkMode((dm) => !dm)}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
