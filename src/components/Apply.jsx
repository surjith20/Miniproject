import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Apply.css';

const Apply = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicantName: '',
    contactEmail: '',
    contactPhone: '',
    propertyType: 'residential',
    propertyAddress: '',
    buildingArea: '',
    floorCount: '',
    fireSafetyFeatures: [],
    documents: [],
    additionalNotes: ''
  });

  const fireSafetyOptions = [
    'Fire Extinguishers', 'Smoke Detectors', 'Fire Alarms', 'Sprinkler System',
    'Emergency Exits', 'Fire Hydrants', 'Fire Escape Stairs', 'First Aid Kits'
  ];

  const propertyTypes = [
    { value: 'residential', label: 'Residential Building' },
    { value: 'commercial', label: 'Commercial Complex' },
    { value: 'industrial', label: 'Industrial Facility' },
    { value: 'hospital', label: 'Hospital/Healthcare' },
    { value: 'educational', label: 'Educational Institution' },
    { value: 'hotel', label: 'Hotel/Hospitality' },
    { value: 'warehouse', label: 'Warehouse/Storage' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (feature) => {
    const updatedFeatures = formData.fireSafetyFeatures.includes(feature)
      ? formData.fireSafetyFeatures.filter(f => f !== feature)
      : [...formData.fireSafetyFeatures, feature];
    setFormData({ ...formData, fireSafetyFeatures: updatedFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('fireDeptAuth'))?.userData;
      if (!user || !user.id) {
        alert('Please login to apply.');
        return;
      }

      const payload = {
        applicantName: formData.applicantName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        propertyType: formData.propertyType,
        propertyAddress: formData.propertyAddress,
        buildingArea: parseFloat(formData.buildingArea) || 0,
        floorCount: parseInt(formData.floorCount, 10) || 0,
        fireSafetyFeatures: formData.fireSafetyFeatures,
        additionalNotes: formData.additionalNotes,
        userId: user.id
      };

      const response = await api.createApplication(payload);
      alert(`Submitted! ID: ${response.id}`);
      navigate(`/status?id=${response.id}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="apply-container animate-fade-in">
      <div className="glass-panel form-card">
        <h2 className="form-title">New NOC Application</h2>
        <form onSubmit={handleSubmit} className="application-form">

          <div className="form-section">
            <h3 className="section-title">Applicant Details</h3>
            <div className="grid-2">
              <input className="glass-input" name="applicantName" placeholder="Full Name" value={formData.applicantName} onChange={handleInputChange} required />
              <input className="glass-input" name="contactEmail" type="email" placeholder="Email" value={formData.contactEmail} onChange={handleInputChange} required />
              <input className="glass-input" name="contactPhone" placeholder="Phone" value={formData.contactPhone} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Property Details</h3>
            <div className="grid-2">
              <select className="glass-input" name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input className="glass-input" name="buildingArea" type="number" placeholder="Total Area (sq ft)" value={formData.buildingArea} onChange={handleInputChange} required />
              <input className="glass-input" name="floorCount" type="number" placeholder="Number of Floors" value={formData.floorCount} onChange={handleInputChange} required />
              <textarea className="glass-input full-width" name="propertyAddress" placeholder="Property Address" value={formData.propertyAddress} onChange={handleInputChange} required rows="2" />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Safety Features</h3>
            <div className="checkbox-grid">
              {fireSafetyOptions.map(f => (
                <label key={f} className="checkbox-label">
                  <input type="checkbox" checked={formData.fireSafetyFeatures.includes(f)} onChange={() => handleCheckboxChange(f)} />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Additional Info</h3>
            <textarea className="glass-input full-width" name="additionalNotes" placeholder="Any special requirements..." value={formData.additionalNotes} onChange={handleInputChange} rows="3" />
          </div>

          <div className="form-actions">
            <button type="submit" className="glass-btn full-width">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Apply;
