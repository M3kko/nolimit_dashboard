import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Analytics.css';

const Analytics = ({ athletesData, darkMode, setDarkMode, SunIcon, MoonIcon }) => {
    const navigate = useNavigate();

    const getProgressClass = (progress) => {
        if (progress >= 90) return 'excellent';
        if (progress >= 80) return 'good';
        if (progress >= 65) return 'moderate';
        return 'low';
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // Calculated metrics
    const totalAthletes = athletesData.length;
    const totalSessions = athletesData.reduce((sum, a) => sum + a.sessions, 0);
    const avgProgress = Math.round(athletesData.reduce((sum, a) => sum + a.weeklyProgress, 0) / totalAthletes);
    const activeCount = athletesData.filter(a => a.status.toLowerCase() === 'active').length;
    const recoveryCount = athletesData.filter(a => a.status.toLowerCase() === 'recovery').length;
    const injuryCount = athletesData.filter(a => a.status.toLowerCase() === 'injury').length;

    // Performance distribution
    const excellentCount = athletesData.filter(a => a.weeklyProgress >= 90).length;
    const goodCount = athletesData.filter(a => a.weeklyProgress >= 80 && a.weeklyProgress < 90).length;
    const moderateCount = athletesData.filter(a => a.weeklyProgress >= 65 && a.weeklyProgress < 80).length;
    const lowCount = athletesData.filter(a => a.weeklyProgress < 65).length;
    const maxPerfCount = Math.max(excellentCount, goodCount, moderateCount, lowCount, 1);

    // Sport breakdown
    const sportStats = athletesData.reduce((acc, athlete) => {
        if (!acc[athlete.sport]) {
            acc[athlete.sport] = { count: 0, sessions: 0, totalProgress: 0 };
        }
        acc[athlete.sport].count++;
        acc[athlete.sport].sessions += athlete.sessions;
        acc[athlete.sport].totalProgress += athlete.weeklyProgress;
        return acc;
    }, {});

    const sportBreakdown = Object.entries(sportStats).map(([sport, data]) => ({
        sport,
        count: data.count,
        sessions: data.sessions,
        avgProgress: Math.round(data.totalProgress / data.count)
    })).sort((a, b) => b.sessions - a.sessions);

    // Attention needed
    const attentionNeeded = athletesData.filter(
        a => a.status.toLowerCase() === 'injury' || a.status.toLowerCase() === 'recovery'
    );

    // Weekly trends (mock)
    const weeklyTrends = [
        { week: 'Week 1', avgProgress: 78, sessions: 52, current: false },
        { week: 'Week 2', avgProgress: 81, sessions: 58, current: false },
        { week: 'Week 3', avgProgress: 84, sessions: 61, current: false },
        { week: 'Week 4', avgProgress: avgProgress, sessions: totalSessions, current: true }
    ];

    return (
        <>
            <header className="analytics-header">
                <div>
                    <h1>Team Analytics</h1>
                    <p className="subtitle">Team-wide performance overview and insights</p>
                </div>
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    <img src={darkMode ? MoonIcon : SunIcon} alt="Toggle theme" />
                </button>
            </header>

            {/* Top KPI Cards */}
            <div className="analytics-metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">Total Athletes</div>
                    <div className="metric-value">{totalAthletes}</div>
                    <div className="metric-change neutral">Team roster</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total Sessions</div>
                    <div className="metric-value">{totalSessions}</div>
                    <div className="metric-change positive">+12% vs last week</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Avg Progress</div>
                    <div className="metric-value">{avgProgress}%</div>
                    <div className={`metric-change ${avgProgress >= 80 ? 'positive' : avgProgress >= 65 ? 'neutral' : 'negative'}`}>
                        {avgProgress >= 80 ? 'On track' : avgProgress >= 65 ? 'Moderate' : 'Needs attention'}
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Active Athletes</div>
                    <div className="metric-value">{activeCount}</div>
                    <div className="metric-change positive">{Math.round((activeCount / totalAthletes) * 100)}% of team</div>
                </div>
            </div>

            {/* Status & Performance Distribution */}
            <div className="analytics-row-2col">
                <div className="analytics-card">
                    <h3 className="section-title-inline">Status Distribution</h3>
                    <div className="status-distribution">
                        <div className="status-bar-item">
                            <div className="status-bar-header">
                                <span className="status-label">Active</span>
                                <span className="status-count">{activeCount}</span>
                            </div>
                            <div className="status-bar-track">
                                <div className="status-bar-fill status-active-fill" style={{ width: `${(activeCount / totalAthletes) * 100}%` }} />
                            </div>
                        </div>
                        <div className="status-bar-item">
                            <div className="status-bar-header">
                                <span className="status-label">Recovery</span>
                                <span className="status-count">{recoveryCount}</span>
                            </div>
                            <div className="status-bar-track">
                                <div className="status-bar-fill status-recovery-fill" style={{ width: `${(recoveryCount / totalAthletes) * 100}%` }} />
                            </div>
                        </div>
                        <div className="status-bar-item">
                            <div className="status-bar-header">
                                <span className="status-label">Injury</span>
                                <span className="status-count">{injuryCount}</span>
                            </div>
                            <div className="status-bar-track">
                                <div className="status-bar-fill status-injury-fill" style={{ width: `${(injuryCount / totalAthletes) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="analytics-card">
                    <h3 className="section-title-inline">Performance Distribution</h3>
                    <div className="performance-distribution">
                        <div className="perf-segment">
                            <span className="perf-count">{excellentCount}</span>
                            <div className="perf-bar-vertical">
                                <div className="perf-bar-fill-vertical excellent" style={{ height: `${(excellentCount / maxPerfCount) * 100}%` }} />
                            </div>
                            <span className="perf-label">90%+</span>
                        </div>
                        <div className="perf-segment">
                            <span className="perf-count">{goodCount}</span>
                            <div className="perf-bar-vertical">
                                <div className="perf-bar-fill-vertical good" style={{ height: `${(goodCount / maxPerfCount) * 100}%` }} />
                            </div>
                            <span className="perf-label">80-89%</span>
                        </div>
                        <div className="perf-segment">
                            <span className="perf-count">{moderateCount}</span>
                            <div className="perf-bar-vertical">
                                <div className="perf-bar-fill-vertical moderate" style={{ height: `${(moderateCount / maxPerfCount) * 100}%` }} />
                            </div>
                            <span className="perf-label">65-79%</span>
                        </div>
                        <div className="perf-segment">
                            <span className="perf-count">{lowCount}</span>
                            <div className="perf-bar-vertical">
                                <div className="perf-bar-fill-vertical low" style={{ height: `${(lowCount / maxPerfCount) * 100}%` }} />
                            </div>
                            <span className="perf-label">&lt;65%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sport Breakdown Table */}
            <h3 className="section-title">Sport Breakdown</h3>
            <div className="sport-breakdown-table-container">
                <table className="sport-breakdown-table">
                    <thead>
                        <tr>
                            <th>Sport</th>
                            <th>Athletes</th>
                            <th>Sessions</th>
                            <th>Avg Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sportBreakdown.map((sport) => (
                            <tr key={sport.sport}>
                                <td className="sport-name-cell">{sport.sport}</td>
                                <td>{sport.count}</td>
                                <td className="sessions-cell">{sport.sessions}</td>
                                <td>
                                    <div className="progress-cell-inline">
                                        <div className="progress-bar-mini">
                                            <div className={`progress-bar-mini-fill ${getProgressClass(sport.avgProgress)}`} style={{ width: `${sport.avgProgress}%` }} />
                                        </div>
                                        <span className="progress-text-mini">{sport.avgProgress}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Weekly Trends */}
            <h3 className="section-title">Weekly Trends</h3>
            <div className="trends-grid">
                {weeklyTrends.map((week, index) => (
                    <div key={index} className={`trend-card ${week.current ? 'current-week' : ''}`}>
                        {week.current && <span className="current-badge">Current</span>}
                        <div className="trend-week">{week.week}</div>
                        <div className="trend-metrics">
                            <div className="trend-metric">
                                <span className="trend-metric-label">Avg Progress</span>
                                <span className="trend-metric-value">{week.avgProgress}%</span>
                            </div>
                            <div className="trend-metric">
                                <span className="trend-metric-label">Sessions</span>
                                <span className="trend-metric-value">{week.sessions}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Needs Attention */}
            <div className="analytics-card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="section-title-inline">Needs Attention</h3>
                {attentionNeeded.length > 0 ? (
                    <div className="attention-list">
                        {attentionNeeded.map((athlete) => (
                            <div key={athlete.id} className={`attention-item ${athlete.status.toLowerCase()}`} onClick={() => navigate(`/athlete/${athlete.id}`)}>
                                <div className="attention-avatar">{getInitials(athlete.name)}</div>
                                <div className="attention-info">
                                    <div className="attention-name">{athlete.name}</div>
                                    <div className="attention-sport">{athlete.sport}</div>
                                </div>
                                <span className={`attention-status ${athlete.status.toLowerCase()}`}>{athlete.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-attention">All athletes are active and healthy!</div>
                )}
            </div>

            {/* Activity Summary */}
            <div className="analytics-card">
                <h3 className="section-title-inline">Activity Summary</h3>
                <div className="activity-summary">
                    <div className="activity-stat">
                        <div className="activity-stat-value">{totalSessions}</div>
                        <div className="activity-stat-label">Total Sessions</div>
                    </div>
                    <div className="activity-stat">
                        <div className="activity-stat-value">{Math.round(totalSessions / totalAthletes)}</div>
                        <div className="activity-stat-label">Avg per Athlete</div>
                    </div>
                    <div className="activity-stat">
                        <div className="activity-stat-value">{Math.max(...athletesData.map(a => a.sessions))}</div>
                        <div className="activity-stat-label">Most Active</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;