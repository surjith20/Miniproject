import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import jsPDF from 'jspdf';
import './Status.css';

const Status = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setTrackingNumber(id);
      fetchStatus(id);
    }
  }, [location]);

  const fetchStatus = async (id) => {
    setError('');
    setStatusData(null);
    try {
      const data = await api.getApplication(id);
      setStatusData(data);
    } catch (err) {
      setError('Application not found');
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingNumber) fetchStatus(trackingNumber);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Fire Safety Application Status', 20, 20);

    doc.setFontSize(16);
    doc.text(`Tracking ID: ${statusData.id}`, 20, 40);
    doc.text(`Status: ${statusData.status}`, 20, 50);

    doc.setFontSize(12);
    doc.text(`Applicant: ${statusData.applicantName || statusData.name || 'N/A'}`, 20, 70);
    doc.text(`Business Name: ${statusData.businessName || 'N/A'}`, 20, 80);
    doc.text(`Address: ${statusData.address || statusData.propertyAddress || 'N/A'}`, 20, 90);
    doc.text(`Type: ${statusData.businessType || statusData.propertyType || 'N/A'}`, 20, 100);
    doc.text(`Submitted Date: ${statusData.submitted_at || new Date().toISOString().split('T')[0]}`, 20, 110);

    if (statusData.status === 'Approved') {
      doc.setTextColor(0, 150, 0);
      doc.text('This application has been APPROVED.', 20, 130);
    }

    doc.save(`FireDept_App_${statusData.id}.pdf`);
  };

  return (
    <div className="status-container animate-fade-in">
      <div className="glass-panel search-panel">
        <h2>Track Application</h2>
        <form onSubmit={handleTrack} className="search-form">
          <input
            className="glass-input"
            placeholder="Enter Application ID (e.g. 1)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button type="submit" className="glass-btn">Track</button>
        </form>
        {error && <p className="error-text">{error}</p>}
      </div>

      {statusData && (
        <div className="status-content-grid">
          <div className="glass-panel result-panel animate-fade-in">
            <div className="status-header">
              <h3>Application #{statusData.id}</h3>
              <span className={`status-pill ${statusData.status}`}>{statusData.status}</span>
            </div>
            {statusData.Inspection && statusData.Inspection.scheduledDate && (
              <div className="inspection-alert" style={{
                background: '#e3f2fd',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                borderLeft: '4px solid #2196f3',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>📅</span>
                <div>
                  <strong>Inspection Scheduled</strong>
                  <p style={{ margin: 0, color: '#555' }}>
                    An officer will visit on <strong>{new Date(statusData.Inspection.scheduledDate).toDateString()}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="result-grid">
              <div className="info-block">
                <label>Business Name</label>
                <p>{statusData.businessName || statusData.applicantName}</p>
              </div>
              <div className="info-block">
                <label>Address</label>
                <p>{statusData.address || statusData.propertyAddress}</p>
              </div>
              <div className="info-block">
                <label>Type</label>
                <p>{statusData.businessType || statusData.propertyType}</p>
              </div>
              <div className="info-block">
                <label>Submitted</label>
                <p>{statusData.submitted_at ? new Date(statusData.submitted_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="action-row">
              <button className="glass-btn secondary" onClick={generatePDF}>
                📄 Download PDF Report
              </button>
            </div>
          </div>

          <div className="glass-panel map-panel animate-fade-in">
            <h3>Property Location</h3>
            <div className="map-container">
              <iframe
                title="Property Location"
                width="100%"
                height="300"
                frameBorder="0"
                style={{ border: 0, borderRadius: '8px' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(statusData.address || statusData.propertyAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;
