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
            value: 14.2,
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
        },
        calories: {
            total: 2847,
            active: 847,
            trend: '+120'
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
        { id: 5, date: '2025-11-15', type: 'HIIT', duration: '35 min', avgHR: 165, maxHR: 189, strain: 18.9 },
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
                    <div className="metric-value-large">{biometrics.recovery.score}%</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.recovery.trend)}`}>
                        {getTrendIcon(biometrics.recovery.trend)} {biometrics.recovery.trend}
                    </div>
                </div>

                <div className={`metric-card-compact ${getStatusClass(biometrics.strain.status)}`}>
                    <div className="metric-label-compact">Daily Strain</div>
                    <div className="metric-value-large">{biometrics.strain.daily}</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.strain.trend)}`}>
                        {getTrendIcon(biometrics.strain.trend)} {biometrics.strain.trend}
                    </div>
                </div>

                <div className={`metric-card-compact ${getStatusClass(biometrics.sleep.status)}`}>
                    <div className="metric-label-compact">Sleep</div>
                    <div className="metric-value-large">{biometrics.sleep.total}h</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.sleep.trend)}`}>
                        {getTrendIcon(biometrics.sleep.trend)} {biometrics.sleep.trend}h
                    </div>
                </div>

                <div className={`metric-card-compact ${getStatusClass(biometrics.hrv.status)}`}>
                    <div className="metric-label-compact">HRV</div>
                    <div className="metric-value-large">{biometrics.hrv.value}</div>
                    <div className={`metric-trend ${getTrendClass(biometrics.hrv.trend)}`}>
                        {getTrendIcon(biometrics.hrv.trend)} {biometrics.hrv.trend} {biometrics.hrv.unit}
                    </div>
                </div>
            </div>

            <div className="section-title-inline">Detailed Biometrics</div>
            <div className="biometrics-grid-detailed">
                <div className="metric-card-small">
                    <div className="metric-label-small">Resting HR</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.rhr.status)}`}>
                        {biometrics.rhr.value}
                    </div>
                    <div className="metric-unit">{biometrics.rhr.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.rhr.trend, true)}`}>
                        {getTrendIcon(biometrics.rhr.trend)} {biometrics.rhr.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">VO₂ Max</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.vo2max.status)}`}>
                        {biometrics.vo2max.value}
                    </div>
                    <div className="metric-unit">{biometrics.vo2max.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.vo2max.trend)}`}>
                        {getTrendIcon(biometrics.vo2max.trend)} {biometrics.vo2max.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">SpO₂</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.spo2.status)}`}>
                        {biometrics.spo2.value}
                    </div>
                    <div className="metric-unit">{biometrics.spo2.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.spo2.trend)}`}>
                        {getTrendIcon(biometrics.spo2.trend)} {biometrics.spo2.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">Resp. Rate</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.respiratoryRate.status)}`}>
                        {biometrics.respiratoryRate.value}
                    </div>
                    <div className="metric-unit">{biometrics.respiratoryRate.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.respiratoryRate.trend)}`}>
                        {getTrendIcon(biometrics.respiratoryRate.trend)}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">Skin Temp</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.skinTemp.status)}`}>
                        {biometrics.skinTemp.value}
                    </div>
                    <div className="metric-unit">{biometrics.skinTemp.unit}</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.skinTemp.trend)}`}>
                        {getTrendIcon(biometrics.skinTemp.trend)} {biometrics.skinTemp.trend}
                    </div>
                </div>

                <div className="metric-card-small">
                    <div className="metric-label-small">Sleep Efficiency</div>
                    <div className={`metric-value-medium ${getStatusClass(biometrics.sleep.status)}`}>
                        {biometrics.sleep.efficiency}
                    </div>
                    <div className="metric-unit">%</div>
                </div>
            </div>

            <div className="section-title-inline">Sleep Breakdown</div>
            <div className="sleep-breakdown-grid">
                <div className="sleep-stat">
                    <div className="sleep-label">Deep</div>
                    <div className="sleep-value">{biometrics.sleep.deep}h</div>
                    <div className="sleep-bar">
                    <div className="sleep-bar-fill deep" style={{ width: `${(biometrics.sleep.deep / biometrics.sleep.total) * 100}%` }}></div>
                    </div>
                </div>
                <div className="sleep-stat">
                    <div className="sleep-label">REM</div>
                    <div className="sleep-value">{biometrics.sleep.rem}h</div>
                    <div className="sleep-bar">
                        <div className="sleep-bar-fill rem" style={{ width: `${(biometrics.sleep.rem / biometrics.sleep.total) * 100}%` }}></div>
                    </div>
                </div>
                <div className="sleep-stat">
                    <div className="sleep-label">Light</div>
                    <div className="sleep-value">{(biometrics.sleep.total - biometrics.sleep.deep -  biometrics.sleep.rem).toFixed(1)}h</div>
                    <div className="sleep-bar">
                        <div className="sleep-bar-fill light" style={{ width: `${((biometrics.sleep.total - biometrics.sleep.deep -  biometrics.sleep.rem) / biometrics.sleep.total) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Activity & Calories */}
            <div className="section-title-inline">Activity</div>
            <div className="activity-grid">
                <div className="metric-card-small">
                    <div className="metric-label-small">Total Calories</div>
                    <div className="metric-value-medium">{biometrics.calories.total}</div>
                    <div className="metric-unit">kcal</div>
                    <div className={`metric-trend-small ${getTrendClass(biometrics.calories.trend)}`}>
                        {getTrendIcon(biometrics.calories.trend)} {biometrics.calories.trend}
                    </div>
                </div>
                <div className="metric-card-small">
                    <div className="metric-label-small">Active Calories</div>
                    <div className="metric-value-medium">{biometrics.calories.active}</div>
                    <div className="metric-unit">kcal</div>
                </div>
            </div>

            {/* Recent Sessions Table */}
            <div className="section-title-inline">Recent Sessions</div>
            <div className="sessions-table-container">
                <table className="sessions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Avg HR</th>
                            <th>Max HR</th>
                            <th>Strain</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentSessions.map((session) => (
                            <tr key={session.id}>
                                <td className="session-date-cell">{session.date}</td>
                                <td className="session-type-cell">{session.type}</td>
                                <td>{session.duration}</td>
                                <td>{session.avgHR} bpm</td>
                                <td>{session.maxHR} bpm</td>
                                <td className={session.strain > 15 ? 'strain-high' : session.strain > 10 ? 'strain-medium' : 'strain-low'}>
                                    {session.strain}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Coach Notes */}
            <div className="section-title-inline">Coach Notes</div>
            <div className="notes-container-compact">
                <textarea
                    className="notes-input-compact"
                    placeholder="Quick notes about this athlete..."
                    rows="3"
                />
                <button className="save-notes-btn-compact">Save</button>
            </div>
        </div>
    );
};

export default AthleteDetail;

