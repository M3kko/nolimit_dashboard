import React from 'react';
import './App.css';

const athletesData = [
  {
    id: 1,
    name: "Alexander",
    sport: "Track & Field",
    weeklyProgress: 94,
    sessions: 12,
    status: "active"
  },
  {
    id: 2,
    name: "Natalie",
    sport: "Swimming",
    weeklyProgress: 88,
    sessions: 10,
    status: "active"
  },
  {
    id: 4,
    name: "Sofia",
    sport: "Gymnastics",
    weeklyProgress: 92,
    sessions: 14,
    status: "recovery"
  },
  {
    id: 5,
    name: "James",
    sport: "Soccer",
    weeklyProgress: 68,
    sessions: 7,
    status: "active"
  },
  {
    id: 6,
    name: "Emma",
    sport: "Tennis",
    weeklyProgress: 85,
    sessions: 11,
    status: "active"
  },
  {
    id: 7,
    name: "Lucas",
    sport: "Swimming",
    weeklyProgress: 45,
    sessions: 4,
    status: "injury"
  },
  {
    id: 8,
    name: "Olivia",
    sport: "Track & Field",
    weeklyProgress: 91,
    sessions: 13,
    status: "active"
  }
];

const getProgressClass = (progress) => {
  if (progress >= 90) return 'progress-excellent';
  if (progress >= 80) return 'progress-good';
  if (progress >= 65) return 'progress-moderate';
  return 'progress-low';
}

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
}

function App() {
const [activeNav, setActiveNav] = React.useState('dashboard');

const totalSessions = athletesData.reduce((sum, athlete) => sum + athlete.sessions, 0);
const activeAthletes = athletesData.filter(athlete => athlete.status === 'active').length;


  return (
    <div className="App">
      <aside className="Sidebar">
        <div className="sidebar-logo">
          <h2>NoLimit</h2>
        </div>
        <nav>
          <ul className="nav-menu">
            <li
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveNav('dashboard')}
            >
              Dashboard
            </li>
            <li
              className={`nav-item ${activeNav === 'athletes' ? 'active' : ''}`}
              onClick={() => setActiveNav('athletes')}
            >
              Athletes
            </li>
            <li
              className={`nav-item ${activeNav === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveNav('analytics')}
            >
              Analytics
            </li>
            <li
              className={`nav-item ${activeNav === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveNav('schedule')}
            >
              Schedule
            </li>
            <li
              className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveNav('settings')}
            >
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h1>Athlete Performance</h1>
          <p className="subtitle">Real-time performance metrics and training analytics</p>
        </header>

        <div className="insights-bar">
          <div className="insight-card">
            <div className="insight-label">Total Sessions</div>
            <div className="insight-value">{totalSessions}</div>
            <div className="insight-change positive">+12% from last week</div>
          </div>
          <div className="insight-card">
            <div className="insight-label">Average Progress</div>
            <div className="insight-value">{Math.round(athletesData.reduce((sum, athlete) => sum + athlete.weeklyProgress, 0) / athletesData.length)}%</div>
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
              <tr key={athlete.id}>
                <td className="athlete-name">{athlete.name}</td>
                <td className="athlete-sport">{athlete.sport}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar ${getProgressClass(athlete.weeklyProgress)}`}
                        style={{ width: `${athlete.weeklyProgress}%` }}
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
      </main>
    </div>
  )
}

export default App;