import React from 'react';
import './AthleteDetail.css';

const AthleteDetail = ({ athlete, onBack}) => {
    if (!athlete) return null;

    const getStatusClass = (status) => {
        switch(status) {
            case 'active': return 'status-active';
            case 'recovery': return 'status-recovery';
            case 'injury': return 'status-injury';
        }
    };

    const getProgressClass = (progress) => {
        if (progress >= 90) return 'progress-excellent';
        if (progress >= 80) return 'progress-good';
        if (progress >= 65) return 'progress-moderate';
        return 'progress-low';
    }

    const recentSessions = [
        { id: 1, date: '2025-11-19', type: 'Strength Training', duration: '45 min', load: 'High'},
        { id: 2, date: '2025-11-18', type: 'Cardio', duartion: '30 min', load: 'Medium'},
        { id: 3, date: '2025-11-17', type: 'Recovery', duration: '20 min', load: 'Low'},
        { id: 4, date: '2025-11-16', type: 'Strength Training', duration: '50 min', load: 'High'},
    ];

    return (
        <div className="athlete-detail-page">
            <button className="athlete-detail-page" onClick={onBack}>
            ← Back
            </button>

            <div className="athlete-detail-header">
                <div className="athlete-detail-avatar">
                    {athlete.name.charAt(0)}
                </div>
                <div className="athlete-detail-info">
                    <h1 className="athlete-detail-name">{athlete.name}</h1>
                    <p className="athlete-detail-sport">{athlete.sport}</p>
                </div>
                <span className={`status-indicator ${getStatusClass(athlete.status)}`}>
                    {athlete.status}
                </span>
            </div>

            <div className="key-metrics-grid">
                <div className="metric-card">
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

                
            </div>

        </div>
    )

}