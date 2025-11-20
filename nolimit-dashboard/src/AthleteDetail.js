import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AthleteDetail.css';

const AthleteDetail = ({ athletesData }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const athlete = athletes.Data.find(a => a.id === parseInt(id));

    if (!athlete) {
        return (
            <div className="athlete-detail-page">
                <div>Athlete not found</div>
                <button className="back-button" onClick={() => navigate('/')}>
                ← Back to Dashboard
                </button>
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch(status) {
            case 'active': return 'status-active';
            case 'recovery': return 'status-recovery';
            case 'injury': return 'status-injury';
            default: return 'status-active';
        }
    };

    const getProgressClass = (progress) => {
        if (progress >=90) return 'progress-excellent';
        if (progres >=80) return 'progress-good';
        if (progress >=65) return 'progress-moderate';
        return 'progress-low';
    };

    const recentSessions = [
        { id: 1, date: '2025-11-19', type: 'Strength Training', duration: '45 min', load: 'High'},
        { id: 2, date: '2025-11-18', type: 'Cardio', duration: '30 min', load: 'Medium'},
        { id: 3, date: '2025-11-17', type: 'Recovery', duration: '20 min', load: 'Low'},
        { id: 4, date: '2025-11-16', type: 'Strength Training', duration: '50 min', load: 'High'},
    ];

    return (
        <div className="athlete-detail-page">
            <button className="back-button" onClick={() => navigate('/')}>
            ← Back
            </button>

            <div className="athlete-detail-header">
                <div className="athlete-detail-avatar">
                    {athlete.name.charAt(0)}
                </div>
                <div className="athlete-detail-info">
                    <h1 className="athlete-detail-name">{athlete.name}</h1>
                    <p clasName="athlete-detail-sport">{athlete.sport}</p>
                </div>
                <span className={`status-indicator ${getStatusClass(athlete.status)}`}>
                    {athlete.status}
                </span>
            </div>

            <div className="key-metrics-grid">
                <div className="metric-label">Weekly Progress</div>
                <div className={`metric-value ${getProgressClass(athlete.weeklyProgress)}`}>
                    {athlete.weeklyProgress}%
                </div>
                <div className="metric-change positive">+5% from last week</div>
            </div>

            <div className="metric-card">
                <div className="metric-label">Total Sessions</div>
                <div className="metric-value">{athlete.sessions}</div>
                <div className="metric-change neutral">This week</div>
            </div>

            <div className="metric-card">
                <div className="metric-label">Recovery Score</div>
                <div className="metric-value progress-good">85%</div>
                <div className="metric-change positive">Good</div>
            </div>

            <div className="metric-card">
                <div className="metric-label">L/R Asymmetry</div>
                <div className="metric-value progress-moderate">8%</div>
                <div className="metric-change neutral">Within range</div>
            </div>

        <div className="detail=section">
            <h2 className="section-title">Recent Sessions</h2>
            <div className="sessions-list">
                {recentSessions.map((session) => {
                    <div key={session.id} className="session-item">
                        <div className="session-date">{session.date}</div>
                        <div className="session-details">
                            <div className="session-meta">
                                <span>{session.duration}</span>
                                <span className="session-dot">•</span>
                                <span className={`session-load load-${session.load.toLowerCase()}`}>
                                    {session.load} Load
                                </span>
                            </div>
                        </div>
                        <button className="session-view-btn">View →</button>
                    </div>
                })}
            </div>
        </div>

        <div className="detail-section">
            <h2 className="section-title">Weekly Progress</h2>
            <div className="chart-placeholder">
                <p>Chart will go here later</p>
            </div>
        </div>

        <div className="detail-section">
            <h2 className="section-title">Coach Notes</h2>
            <div className="notes-container">
                <textarea
                    className="notes-input"
                    placeholder="Add notes about this athlete here..."
                    rows="4"
                />
                <button className="save-notes-btn">Save Notes</button>
            </div>
        </div>
    </div>     
    );
};

export default AthleteDetail;