import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './Settings.css';

const Settings = ({ userData, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || ''
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedUser = await api.updateProfile({
                name: formData.name,
                phone: formData.phone
            });
            alert('Profile updated successfully!');
            if (onUpdateUser) onUpdateUser(updatedUser);
        } catch (error) {
            alert(error.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2>Account Settings</h2>
                <p>Manage your profile and preferences</p>
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    <button
                        className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        👤 My Profile
                    </button>
                    <button
                        className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        🔒 Security
                    </button>
                    <button
                        className={`settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        🔔 Notifications
                    </button>
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in">
                            <div className="profile-section-header">
                                <div className="profile-avatar-large">
                                    {userData?.name?.charAt(0) || 'U'}
                                </div>
                                <h3 className="section-title">Personal Information</h3>
                            </div>

                            <form onSubmit={handleProfileUpdate}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="settings-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        className="settings-input"
                                        value={formData.email}
                                        disabled
                                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                    />
                                    <small style={{ color: '#888', marginTop: '0.5rem', display: 'block' }}>Email cannot be changed directly.</small>
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="settings-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 9876543210"
                                    />
                                </div>

                                <button type="submit" className="save-btn" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <h3 className="section-title">Change Password</h3>
                            <form>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input type="password" class="settings-input" placeholder="••••••••" />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input type="password" class="settings-input" placeholder="••••••••" />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input type="password" class="settings-input" placeholder="••••••••" />
                                </div>
                                <button type="button" className="save-btn" onClick={() => alert('Password update feature coming soon!')}>Update Password</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in">
                            <h3 className="section-title">Notification Preferences</h3>
                            <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="checkbox" id="emailNotif" defaultChecked />
                                <label htmlFor="emailNotif" style={{ margin: 0 }}>Email Notifications</label>
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <input type="checkbox" id="smsNotif" />
                                <label htmlFor="smsNotif" style={{ margin: 0 }}>SMS Alerts</label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
