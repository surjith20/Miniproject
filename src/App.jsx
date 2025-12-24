import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Apply from './components/Apply';
import Status from './components/Status';
import Admin from './components/Admin';
import Settings from './components/Settings';
import './App.css'; // We will clean this file

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('applicant');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('fireDeptAuth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setUserRole(authData.role);
      setUserData(authData.userData);
    }
  }, []);

  const handleLogin = (userData, role, token) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData(userData);
    const authData = { role, userData, token, timestamp: new Date().getTime() };
    localStorage.setItem('fireDeptAuth', JSON.stringify(authData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('applicant');
    setUserData(null);
    localStorage.removeItem('fireDeptAuth');
  };

  const handleRegister = (userData, role) => {
    handleLogin(userData, role);
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated ? (
          <>
            <nav className="navbar">
              <div className="logo-section">
                <div className="fire-icon">🔥</div>
                <div className="logo-text">
                  <h1>Fire Safety Portal</h1>
                  <p>Real-Time Monitoring</p>
                </div>
              </div>

              <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                {userRole === 'applicant' && (
                  <>
                    <Link to="/apply" className="nav-link">Apply Now</Link>
                    <Link to="/status" className="nav-link">Check Status</Link>
                  </>
                )}
                {(userRole === 'admin' || userRole === 'official') && (
                  <Link to="/admin" className="nav-link">Dashboard</Link>
                )}

                <div className="user-section">
                  <Link to="/settings" className="user-avatar-link">
                    <span className="user-avatar">
                      {userData?.name?.charAt(0) || userData?.email?.charAt(0) || 'U'}
                    </span>
                  </Link>
                  <button className="glass-btn-sm" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </nav>

            <main className="main-content animate-fade-in">
              <Routes>
                <Route path="/" element={<Home userRole={userRole} userData={userData} />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/status" element={<Status />} />
                <Route path="/settings" element={<Settings userData={userData} onUpdateUser={handleLogin} />} />
                <Route path="/admin" element={<Admin userRole={userRole} userData={userData} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            <footer className="footer glass-panel">
              <p>© 2024 Fire Safety Department. Secure & Transparent.</p>
            </footer>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
