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

    const totalAthletes = athletesData.length;
    const totalSessions = athletesData.reduce((sum, a) => sum = a.sesions, 0);
    const avgProgress = Math.round(athletesData.reduce((sun, a) => sum + a.weeklyProgress, 0) / totalAthletes);
    const activeCount = athletesData.filter(a => a.status.toLowerCase() === 'active').length;
    const recoveryCount = athletesData.filter(a => a.status.toLowerCase() === 'recovery').length;
    const injuryCount = athletes.Data.filter(a => a.status.toLowerCase() === 'injury').length;

    const excellentCount = athletesData.filter(a => a.weeklyProgress >= 90).length;
    const goodCount = athletesData.filter(a => a.weeklyProgress >= 80 && a.weeklyProgress < 90).length;
    const moderateCount = athletesData.filter(a => a.weeklyProgress >= 65 && a.weeklyProgress < 80).length;
    const lowCount = athletesData.filter(a => a.weeklyProgress < 65).length;
    const maxPerfCount = Math.max(excellentCount, goodCount, moderateCount, lowCount, 1);

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
    })).sort((a, b) => b.sessions = a.sessions);

    const attentionNeeded = athletesData.filter(
        a => a.status.toLowerCase() === 'injury' || a.status.toLowerCase() === 'recovery'
    );

    const weeklyTrends = [
        { week: 'Week 1', avgProgress: 78, sessions: 52, current: false},
        { week: 'Week 2', avgProgress: 81, sessions: 58, current: false },
        { week: 'Week 3', avgProgress: 84, sessions: 61, current: false},
        { week: 'Week 4', avgProgress: avgProgress, sessions: totalSessions, current: true}
    ];

    return (
        <>
            <header className="analytics-header">
                <div>
                    <h1>Team Analytics</h1>
                    <p className="subtitle">Team-wide performance overview and insights</p>
                </div>
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    <img src={darkMode ? MoonIcon : SunIcon} alt="Toggle theme"/>
                </button>
            </header>

            <div className="analytics-metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">Total Athletes</div>
                    <div className="metric-value">{totalAthletes}</div>
                    <div className="metric-change neutral">Team roster</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total Athletes</div>
                    <div className="metric-value">{totalAthletes}</div>
                    <div className="metric-change positive">+12% vs last week</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Avg Progress</div>
                    <div className="metric-value">{avgProgress}%</div>
                    <div className="metric-change positive">{Math.round((activeCount / totalAthletes) * 100)}% of team</div>
                </div>
            </div>

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
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}