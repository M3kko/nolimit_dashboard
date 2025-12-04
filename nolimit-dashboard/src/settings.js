import React from 'react';
import './settings.css'

const Settings = ({ darkMode, setDarkMode, SunIcon, MoonIcon }) => {
    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>
                <p className="subtitle">Manage your preferences</p>
            </div>

            <div className="settings-section">
                <div className="settings-section-title">Appearance</div>
                <div className="settings-item">
                    <div className="settings-item-info">
                        <div className="settings-item-label">Dark Mode</div>
                        <div className="settings-item-description">Toggle between light and dark theme</div>
                    </div>
                    <div
                        className={`toggle-switch ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(!darkMode)}
                    />
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-title">Notifications</div>
                <div className="settings-item">
                    <div className="settings-item-info">
                        <div className="settings-item-label">Email Notifications</div>
                        <div className="settings-item-description">Receive updates via email</div>
                    </div>
                    <div className="toggle-switch" />
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-title">Account</div>
                <div className="settings-item">
                    <div className="settings-item-info">
                        <div className="settings-item-label">Change Email</div>
                        <div className="settings-item-description">Update your email address</div>
                    </div>
                    <button className="settings-btn secondary">Change</button>
                </div>
                <div className="settings-item">
                    <div className="settings-item-info">
                        <div className="settings-item-label">Change password</div>
                        <div className="settings-item-description">Update your password</div>
                    </div>
                    <button className="settings-btn secondary">Change</button>
                </div>
            </div>
        </div>

        
    );
};

export default Settings;