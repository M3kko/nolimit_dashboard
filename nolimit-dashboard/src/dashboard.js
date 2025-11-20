import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ athletesData }) => {
    const navigate = useNavigate();

    const getProgressClass = (progress) => {
        if (progress >= 90) return 'progress-excellent';
        if (progress >= 80) return 'progress-good';
        if (progress >= 65) return 'progress-moderate';
        return 'progress-low';
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'active': return 'status-active';
            case 'recovery': return 'status-recovery';
            case 'injury': return 'status-injury';
            default: return 'status-active';
        }
    };

    const getSessionsClass = (sessions) => {
        if (sessions >= 12) return 'metric-high';
        if (sessions >= 8) return 'metric-medium';
        return 'metric-low';
    };

    const totalSessions = athletesData.reduce((sum, athlete) => sum + athlete.sessions, 0);
    const activeAthletes = athletesData.filter(athlete => athlete.status === 'active').length;

    const handleAthleteClick = (athleteId) => {
        navigate(`/athlete/${athleteId}`);
    };

    return (
        <>
        <header className="dashboard-header">
            <div>
                <h1>Athlete Performance</h1>
                <p className="subtitle">Real-time performance metrics and training analytics</p>
            </div>
        </header>

        <div className="insights-bar">
            <div className="insight-card">
                <div className="insight-label">Total Sessions</div>
                <div className="insight-value">{totalSessions}</div>
                <div className="insight-change positive">+12% from last week</div>
            </div>
            <div className="insight-card">
                <div className="insight-label">Average Progress</div>
                <div className="insight-value">
                {Math.round(athletesData.reduce((sum, athlete) => sum + athlete.weeklyProgress, 0) / athletesData.length)}%
                </div>
                <div className="insight-change positive">+5% from last week</div>
            </div>
            <div className="insight-card">
                <div className="insight-label">Active Athletes</div>
                <div className="insight-value">{activeAthletes}</div>
                <div className="insight-change neutral">No change</div>
            </div>
        </div>

        <table className="athlete-table">
            <thead>
                <tr>
                    <th>ATHLETE</th>
                    <th>SPORT</th>
                    <th>WEEKLY PROGRESS</th>
                    <th>SESSIONS</th>
                    <th>STATUS</th>
                </tr>
            </thead>
            <tbody>
                {athletesData.map((athlete) => (
                    <tr
                      key={athlete.id}
                      onClick={() => handleAthleteClick(athlete.id)}
                      style={{ cursor: 'pointer' }}
                    >
                        <td className="athlete-name">{athlete.name}</td>
                        <td className="athlete-sport">{athlete.sport}</td>
                        <td>
                            <div className="progress-cell">
                                <div className="progress-bar-container">
                                    <div
                                    className={`progress-bar ${getProgressClass(athlete.weeklyProgress)}`}
                                    style={{ width: `${athlete.weeklyProgress}%`}}
                                    />
                                </div>
                                <span className={`progress-text ${getProgressClass(athlete.weeklyProgress)}`}>
                                    {athlete.weeklyProgress}%
                                </span>
                            </div>
                        </td>
                        <td className={`sessions-count ${getSessionsClass(athlete.sessions)}`}>
                            {athlete.sessions}
                        </td>
                        <td>
                            <span className={`status-indicator ${getStatusClass(athlete.status)}`}>
                                {athlete.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>


        </>
    )


}

export default Dashboard;