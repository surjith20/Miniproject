import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import './Admin.css';

const Admin = ({ userRole, userData }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'dashboard');
  const [applications, setApplications] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [userRole]);

  const fetchData = async () => {
    try {
      const promises = [
        api.getApplications(),
        api.getInspections(),
      ];
      if (userRole === 'admin') {
        promises.push(api.getUsers());
      }

      const [apps, insps, usrs] = await Promise.all(promises);
      setApplications(apps);
      setInspections(insps);
      if (usrs) setUsers(usrs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.updateApplication(id, { status: newStatus });
      fetchData();
    } catch (e) {
      alert("Update failed");
    }
  };

  const handleScheduleInspection = async (appId) => {
    const date = prompt("Enter Inspection Date (YYYY-MM-DD):");
    if (date) {
      try {
        // Correct endpoint for creating inspection
        await api.createInspection({ applicationId: appId, scheduledDate: date, status: 'scheduled' });
        fetchData();
      } catch (e) {
        alert('Failed to schedule');
      }
    }
  };

  return (
    <div className="admin-container animate-fade-in">
      <div className="glass-panel sidebar">
        <h3>Admin Panel</h3>
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`nav-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Applications</button>
        <button className={`nav-btn ${activeTab === 'inspections' ? 'active' : ''}`} onClick={() => setActiveTab('inspections')}>Inspections</button>
        <button className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Reports</button>
        {userRole === 'admin' && <button className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button>}
      </div>

      <div className="content-area">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="glass-panel stat-box">
              <h3>Applications</h3>
              <p className="big-number">{applications.length}</p>
            </div>
            <div className="glass-panel stat-box">
              <h3>Pending</h3>
              <p className="big-number">{applications.filter(a => a.status === 'submitted').length}</p>
            </div>
            <div className="glass-panel stat-box">
              <h3>Inspections</h3>
              <p className="big-number">{inspections.length}</p>
            </div>
            {userRole === 'admin' && (
              <div className="glass-panel stat-box">
                <h3>Users</h3>
                <p className="big-number">{users.length}</p>
              </div>
            )}

            <div className="glass-panel full-width-panel" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h3>Recent Scheduled Inspections</h3>
              {inspections.filter(i => i.status === 'scheduled').length > 0 ? (
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>App ID</th>
                      <th>Scheduled Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspections
                      .filter(i => i.status === 'scheduled')
                      .slice(0, 5) // Show top 5
                      .map(insp => (
                        <tr key={insp.id}>
                          <td>#{insp.applicationId}</td>
                          <td>{insp.scheduledDate || insp.inspectionDate}</td>
                          <td><span className={`status-pill ${insp.status}`}>{insp.status}</span></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ padding: '1rem', color: '#666' }}>No upcoming inspections scheduled.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="glass-panel table-panel">
            <h3>Applications</h3>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Business</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>{app.applicantName || app.businessName}</td>
                    <td><span className={`status-pill ${app.status}`}>{app.status}</span></td>
                    <td>
                      {app.status === 'submitted' && (
                        <button className="glass-btn-sm" onClick={() => handleStatusUpdate(app.id, 'under_review')}>Review</button>
                      )}
                      {app.status === 'under_review' && (
                        <button className="glass-btn-sm" onClick={() => handleScheduleInspection(app.id)}>Schedule</button>
                      )}
                      {app.status === 'inspection_completed' && (
                        <>
                          <button className="glass-btn-sm" onClick={() => handleStatusUpdate(app.id, 'approved')}>Approve</button>
                          <button className="glass-btn-sm" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleStatusUpdate(app.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="glass-panel table-panel">
            <h3>Inspections</h3>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>App ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map(insp => (
                  <tr key={insp.id}>
                    <td>#{insp.id}</td>
                    <td>#{insp.applicationId}</td>
                    <td>{insp.scheduledDate || insp.inspectionDate}</td>
                    <td><span className={`status-pill ${insp.status}`}>{insp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && userRole === 'admin' && (
          <div className="glass-panel table-panel">
            <h3>User Management</h3>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="highlight-role">{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="glass-panel table-panel">
            <h3>System Reports</h3>
            <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>

              <div className="report-card" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#555' }}>Application Status Breakdown</h4>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Submitted</span>
                  <strong>{applications.filter(a => a.status === 'submitted').length}</strong>
                </div>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Under Review</span>
                  <strong>{applications.filter(a => a.status === 'under_review').length}</strong>
                </div>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Approved</span>
                  <strong style={{ color: 'green' }}>{applications.filter(a => a.status === 'approved').length}</strong>
                </div>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Rejected</span>
                  <strong style={{ color: 'red' }}>{applications.filter(a => a.status === 'rejected').length}</strong>
                </div>
              </div>

              <div className="report-card" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: '#555' }}>Inspection Performance</h4>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Total Inspections</span>
                  <strong>{inspections.length}</strong>
                </div>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Pending Completion</span>
                  <strong>{inspections.filter(i => i.status !== 'completed').length}</strong>
                </div>
                <div className="stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Completed</span>
                  <strong style={{ color: 'blue' }}>{inspections.filter(i => i.status === 'completed').length}</strong>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
