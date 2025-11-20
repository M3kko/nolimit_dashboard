import React from 'react';
import { Routes, Route} from 'react-fouter-dom';
import './App.css';
import SunIcon from './assets/sun-high.svg';
import MoonIcon from './assets/moon-stars.svg';
import Dashboard from './AthleteDetail';
import AthleteDetail from './AthleteDetail';

const athletesData = [
  {
    id: 1,
    name: "Alexander",
    sport: "Track & Field",
    weeklyProgress: 94,
    sessions: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Natalie",
    sport: "Swimming",
    weeklyProgress: 88,
    sessions: 10,
    status: "active",
  },
  {
    id: 3,
    name: "Sofia",
    sport: "Gymnastics",
    weeklyProgress: 92,
    sessions: 14,
    status: "recovery"
  },
  {
    id: 4,
    name: "James",
    sport: "Soccer",
    weeklyProgress: 68,
    sessions: 7,
    status: "active",
  },
  {
    id: 5,
    name: "Emma",
    sport: "Tennis",
    weeklyProgress: 85,
    sessions: 11,
    status: "active",
  },
  {
    id: 6,
    name: "Lucas",
    sport: "Swimming",
    weeklyProgress: 45,
    sessions: 4,
    status: "Injury"
  },
  {
    id: 7,
    name: "Olivia",
    sport: "Track & Field",
    weeklyProgress: 91,
    sessions: 13,
    status: "active"
  }
];

function App() {
  const [activeNav, setActiveNav] = React.useState('dashboard');
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <aside classname="Sidebar">
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
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            <img src={darkMode ? MoonIcon : SunIcon} alt="Toggle theme" />
          </button>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard athletesData={athletesData} />} />
          <Route path="/athlete/:id" element={<AthleteDetail athletesData={athletesData} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 