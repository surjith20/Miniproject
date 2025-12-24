import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ userRole, userData }) => {
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    if (userRole === 'applicant' && userData?.id) {
      api.getApplications(userData.id)
        .then(data => setMyApplications(data))
        .catch(err => console.error('Failed to fetch applications', err));
    } else if (userRole === 'admin' || userRole === 'official') {
      // Fetch all applications to get pending count
      api.getApplications()
        .then(data => setMyApplications(data))
        .catch(err => console.error('Failed to fetch stats', err));
    }
  }, [userRole, userData]);

  const stats = [
    { label: 'Total Applications', value: '2,847', change: '+12%', icon: '📄' },
    { label: 'Avg. Turnaround', value: '3.2 Days', change: '-18%', icon: '⚡' },
    { label: 'Compliance Rate', value: '94.7%', change: '+5%', icon: '✅' },
    { label: 'Pending Inspections', value: '156', change: '-8%', icon: '🔍' },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="glass-panel welcome-card animate-fade-in">
        <div className="hero-content">
          <div className="hero-text">
            <span className="badge-new">Fire Safety Portal v2.0</span>
            <h1>
              Welcome to the <br />
              <span className="text-gradient">Command Center</span>
            </h1>
            <p className="subtitle">
              User: <strong className="text-white">{userData?.name || 'Guest'}</strong> |
              Role: <strong className="highlight-role">{userRole.toUpperCase()}</strong>
            </p>
          </div>

          <div className="action-buttons-grid">
            {userRole === 'applicant' ? (
              <>
                <Link to="/apply" className="action-card primary">
                  <span className="action-icon">📝</span>
                  <span className="action-text">New Application</span>
                  <span className="action-arrow">→</span>
                </Link>
                <Link to="/status" className="action-card secondary">
                  <span className="action-icon">📊</span>
                  <span className="action-text">Track Status</span>
                  <span className="action-arrow">→</span>
                </Link>
                <a href="#resources" className="action-card tertiary">
                  <span className="action-icon">📚</span>
                  <span className="action-text">Guidelines</span>
                  <span className="action-arrow">→</span>
                </a>
              </>
            ) : (
              <>
                <Link to="/admin" className="action-card primary">
                  <span className="action-icon">🛡️</span>
                  <span className="action-text">Dashboard</span>
                  <span className="action-arrow">→</span>
                </Link>

                <Link to="/admin" state={{ activeTab: 'applications' }} className="action-card secondary">
                  <div className="action-content" style={{ justifyContent: 'center', flexDirection: 'column' }}>
                    <span className="action-icon">📂</span>
                    <span className="action-text">Pending Cases</span>
                    {myApplications.some(a => a.status === 'submitted') && (
                      <span className="pending-badge">
                        {myApplications.filter(a => a.status === 'submitted').length} New
                      </span>
                    )}
                  </div>
                  <span className="action-arrow">→</span>
                </Link>

                <Link to="/admin" state={{ activeTab: 'reports' }} className="action-card tertiary">
                  <span className="action-icon">📈</span>
                  <span className="action-text">Reports</span>
                  <span className="action-arrow">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Stats Ticker */}
      <div className="section-header">
        <h2>Live System Metrics</h2>
        <div className="live-indicator">
          <span className="blink">●</span> Live
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="glass-panel stat-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-top">
              <span className="stat-icon-bg">{stat.icon}</span>
              <div className={`stat-change ${stat.change.includes('+') ? 'good' : 'neutral'}`}>
                {stat.change}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Applicant's Recent Activity */}
      {userRole === 'applicant' && (
        <section className="glass-panel apps-preview animate-fade-in-up">
          <div className="apps-header">
            <h3>Recent Applications</h3>
            <Link to="/status" className="view-all-link">View All</Link>
          </div>

          {myApplications.length === 0 ? (
            <div className="empty-state">
              <p>No active applications found.</p>
              <Link to="/apply" className="text-link">Start a new one now</Link>
            </div>
          ) : (
            <div className="list-preview">
              {myApplications.slice(0, 3).map(app => (
                <div key={app.id} className="app-row">
                  <div className="app-info">
                    <span className="app-id">#{app.id}</span>
                    <span className="app-name">{app.businessName}</span>
                  </div>
                  <div className="app-meta">
                    <span className="app-date">{new Date().toLocaleDateString()}</span>
                    <span className={`status-pill ${app.status}`}>{app.status}</span>
                  </div>
                  {app.Inspection && app.Inspection.scheduledDate && (
                    <div className="app-schedule" style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#2196f3' }}>
                      📅 Insp: {new Date(app.Inspection.scheduledDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Features / Resources */}
      <section className="info-grid" id="resources">
        <div className="glass-panel info-card">
          <h3>🚀 Fast Processing</h3>
          <p>Automated workflow ensures your NOC is processed within 3 days.</p>
        </div>
        <div className="glass-panel info-card">
          <h3>🛡️ Secure Data</h3>
          <p>End-to-end encryption for all your building plans and documents.</p>
        </div>
        <div className="glass-panel info-card">
          <h3>📱 Mobile Ready</h3>
          <p>Inspectors use our mobile app for real-time site verification.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
