import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AthleteDetail.css';

const AthleteDetail = ({ athletesData }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const athlete = athletesData.find(a => a.id === parseInt(id));

    if (!athlete) {
        return (
            <div className="athlete-detail-page">
                <div>athlete not found</div>
                <button className="back-button" onClick={() => navigate('/')}></button>
            </div>
        );
    }

    const biometrics = {
        recovery: {
            score: 87,
            trend: '+3',
            status: 'good'
        },
        hrv: {
            value: 65,
            trend: '+8',
            status: 'excellent',
            unit: 'ms'
        },
        rhr: {
            value: 52,
            trend: '-2',
            status: 'excellent',
            unit: 'bpm'
        },
        sleep: {
            total: 7.8,
            deep: 1.9,
            rem: 2.1,
            efficiency: 92,
            trend: '+0.5',
            status: 'good'
        },
        strain: {
            daily: 14.2,
            trend: '+1.8',
            status: 'moderate'
        },
        vo2max: {
            value: 58,
            trend: "+2",
            status: 'excellent',
            unit: 'ml/kg/min'
        },
        respiratoryRate: {
            value: 14.,
            trend: '0',
            status: 'good',
            unit: 'brpm'
        },
        spo2: {
            value: 98,
            trend: '0',
            status: 'excellent',
            unit: '%'
        },
        skinTemp: {
            value: 33.4,
            trend: '+0.2',
            status: 'good',
            unit: '°C'
        }
    };

    const getStatusClass = (status) => {
        switch(status?.toLowerCase()) {
            case 'excellent': return 'metric-excellent';
            case 'good': return 'metric-good';
            case 'moderate': return 'metric-moderate';
            case 'low': return 'metric-low';
            case 'active': return 'status-active';
            case 'recovery': return 'status-recovery';
            case 'injury': return 'status-injury';
            default: return 'metric-good';
        }
    };

    const getTrendIcon = (trend) => {
        if (!trend || trend === '0') return '→';
        return trend.startsWith('+') ? '↑' : '↓';
    };

    const getTrendClass = (trend, inverse = false) => {
        if (!trend || trend === '0') return 'trend-neutral';
        const isPositive = trend.startsWith('+');
        if (inverse) {
            return isPositive ? 'trend-negative' : 'trend-positive';
        }
        return isPositive ? 'trend-positive' : 'trend-negative';
    };
    
    const recentSessions = [
        { id: 1, date: '2025-11-19', type: 'Strength Training', duration: '45 min', avgHR: 142, maxHR: 178, strain: 16.2 },
        { id: 2, date: '2025-11-18', type: 'Cardio', duration: '30 min', avgHR: 155, maxHR: 172, strain: 12.8 },
        { id: 3, date: '2025-11-17', type: 'Recovery', duration: '20 min', avgHR: 98, maxHR: 115, strain: 4.2 },
        { id: 4, date: '2025-11-16', type: 'Strength Training', duration: '50 min', avgHR: 138, maxHR: 182, strain: 17.5 },
        { id: 4, date: '2025-11-16', type: 'Strength Training', duration: '50 min', avgHR: 138, maxHR: 182, strain: 17.5 },
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
                    <h1 className="athelte-detail-name">{athlete.name}</h1>
                    <p className="athlete-detail-sport">{athlete.sport}</p>
                </div>
                <span className={`status-indicator ${getStatusClass(athlete.status)}`}>
                    {athlete.status}
                </span>
            </div>

            <div className="section-title-inline">Today's Snapshot</div>
            <div className="biometrics-grid-primary">
                <div className={`metric-card-compact ${getStatusClass(biometrics.recovery.status)}`}>
                    <div className="metric-label-compact">Recovery Score</div>
                    <div className="metric-label-value-large">{biometrics.recovery.score}%</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.recovery.trend)}`}>
                        {getTrendIcon(biometrics.recovery.trend)} {biometrics.recovery.trend}
                    </div>
                </div>

                
            </div>
        </div>
    )
}

