import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Athletes.css';

const Athletes = ({ athletesData, darkMode, setDarkMode, SunIcon, MoonIcon}) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSport, setFilterSport] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const getStatusClass = (status) => {
        switch(status.toLowerCase()) {
            case 'active': return 'status-active';
            case 'recovery': return 'status-recovery';
            case 'injury': return 'status-injury';
            default: return 'status-active';
        }
    };

    const getProgressClass = (progress) => {
        if (progress >= 90) return 'progress-excellent';
        if (progress >= 80) return 'progress-good';
        if (progress >= 65) return 'progress-moderate';
        return 'progress-low';
    };

    const sports = ['all', ...new Set(athletesData.map(a => a.sport))];

    const filteredAthletes = athletesData
        .filter(athlete => {
            const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSport = filterSport === 'all' || athlete.sport === filterSport;
            const matchesStatus = filterStatus === 'all' || athlete.status.toLowerCase() === filterStatus.toLowerCase();
            return matchesSearch && matchesSport && matchesStatus;
        })
        .sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                    case 'progress':
                        return b.weeklyProgress - a.weeklyProgress;
                    case 'sessions':
                        return b.sessions - a.sessions;
                    default:
                        return 0;
            }
        });

    return (
        <>
            <header className="dashboard-header">
                <div>
                    <h1>Athletes</h1>
                    <p className="subtitle">Manage your athlete roster</p>
                </div>
                <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                    <img src={darkMode ? MoonIcon : SunIcon} alt="Toggle theme" />
                </button>
            </header>

            <div className="athletes-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search athletes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    /> 
                </div>

                <div className="filters">
                    <select
                        value={filterSport}
                        onChange={(e) => setFilterSport(e.target.value)}
                        className="filter-select"
                    >
                        {sports.map(sport => (
                            <option key={sport} value={sport}>
                                {sport === 'all' ? 'all Sports' : sport}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="recovery">Recovery</option>
                        <option value="injury">Injury</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-select"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="progress">Sort by Progress</option>
                        <option value="sessions">Sort by Sessions</option>
                    </select>
                </div>
            </div>

            <div className="athletes-stats">
                <div className="stat-badge">
                    <span className="stat-number">{filteredAthletes.length}</span>
                    <span className="stat-label">Athletes Found</span>
                </div>
            </div>

            <div className="athletes-grid">
                {filteredAthletes.map((athlete) => (
                    <div
                        key={athlete.id}
                        className="athlete-card"
                        onClick={() => navigate(`/athlete/${athlete.id}`, { state: { from: 'athletes' } })}
                    >
                        <div className="athlete-card-header">
                            <div className="athlete-avatar-large">
                                {athlete.name.charAt(0)}
                            </div>
                            <span className={`status-badge ${getStatusClass(athlete.status)}`}>
                                {athlete.status}
                            </span>
                        </div>

                        <div className="athlete-card-body">
                            <h3 className="athlete-card-name">{athlete.name}</h3>
                            <p className="athlete-card-sport">{athlete.sport}</p>

                            <div className="athlete-card-stats">
                                <div className="card-stat">
                                    <div className="card-stat-label">Weekly Progress</div>
                                    <div className={`card-stat-value ${getProgressClass(athlete.weeklyProgress)}`}>
                                        {athlete.weeklyProgress}%
                                    </div>
                                </div>
                                <div className="card-stat">
                                    <div className="card-stat-label">Sessions</div>
                                    <div className="card-stat-value">{athlete.sessions}</div>
                                </div>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className={`progress-bar ${getProgressClass(athlete.weeklyProgress)}`}
                                    style={{ width: `${athlete.weeklyProgress}%` }}
                                />
                            </div>
                        </div>

                        <div className="athlete-card-footer">
                            <button className="view-details-btn">View Details →</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAthletes.length === 0 && (
                <div className="no-results">
                    <p>No athletes found matching your criteria</p>
                </div>
            )}
        
        </>
    );
};

export default Athletes;