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
  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>Athlete Performance</h1>
        <p className="subtitle">Real-time performance metrics and training analytics</p>
      </header>

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
    </div>
  )
}

export default App;