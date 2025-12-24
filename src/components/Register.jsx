import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Auth.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'applicant'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.register(formData);
      onRegister(data.user, data.user.role, data.token);
      navigate('/');
    } catch (error) {
      alert(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="glass-panel auth-card wide">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the Fire Safety Portal</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input className="glass-input" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
          <input className="glass-input" name="email" type="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} />
          <input className="glass-input" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <input className="glass-input" name="password" type="password" placeholder="Password" required value={formData.password} onChange={handleChange} />

          <div className="role-select-group">
            <label className={`role-card ${formData.role === 'applicant' ? 'selected' : ''}`}>
              <input type="radio" name="role" value="applicant" checked={formData.role === 'applicant'} onChange={handleChange} />
              <span>Applicant</span>
            </label>
            <label className={`role-card ${formData.role === 'official' ? 'selected' : ''}`}>
              <input type="radio" name="role" value="official" checked={formData.role === 'official'} onChange={handleChange} />
              <span>Official</span>
            </label>
          </div>

          <button type="submit" className="glass-btn full-width" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
