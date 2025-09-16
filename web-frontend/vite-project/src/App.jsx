import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import api, { getToken }           from "./api";
import ProtectedRoute               from "./components/ProtectedRoute";

import Background                   from "./components/Background";
import NavBar                       from "./components/NavBar";
import Footer                       from "./components/Footer";

import LandingPage                  from "./pages/LandingPage";
import Login                        from "./pages/Login";
import Register                     from "./pages/Register";
import Calculator                   from "./pages/Calculator";
import AdPage                       from "./pages/AdPage";
import HistoryPanel                 from "./pages/HistoryPanel";

import AdminModels                  from "./pages/AdminModels";

export default function App() {
  const [darkMode, setDarkMode]               = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (getToken()) setIsAuthenticated(true);
  }, []);

  return (
    <Router>
      <Background />
      <div style={{ position: "relative", zIndex: 0 }}>
        <NavBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />

        <Routes>
          {/* Public */}
          <Route path="/"           element={<LandingPage   darkMode={darkMode} />} />
          <Route path="/login"      element={<Login         darkMode={darkMode} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register"   element={<Register      darkMode={darkMode} setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/calculator" element={<Calculator    darkMode={darkMode} isAuthenticated={isAuthenticated} />} />
          <Route path="/ad"         element={<AdPage        darkMode={darkMode} />} />

          {/* Protected */}
          <Route
            path="/history"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HistoryPanel darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminModels darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<h2 className="text-center my-5">404 - Not Found</h2>} />
        </Routes>

        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}
