import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import SunIcon from './assets/sun-high.svg';
import MoonIcon from './assets/moon-stars.svg';
import Dashboard from './dashboard';
import Athletes from './athletes';
import AthleteDetail from './AthleteDetail';
import Analytics from './analytics';

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
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/') {
      setActiveNav('dashboard');
    } else if (location.pathname === '/athletes') {
      setActiveNav('athletes');
    } else if (location.pathname === '/analytics') {
      setActiveNav('analytics');
    } else if (location.pathname.startsWith('/athlete/')) {
      setActiveNav(location.state?.from || 'athletes');
    }
  }, [location]);

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <aside className="Sidebar">
        <div className="sidebar-logo">
          <h2>NoLimit</h2>
        </div>
        <nav>
          <ul className="nav-menu">
            <li
            className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('/')}
            >
              Dashboard
            </li>
            <li
            className={`nav-item ${activeNav === 'athletes' ? 'active' : ''}`}
            onClick={() => navigate('/athletes')}
            >
              Athletes
            </li>
            <li
            className={`nav-item ${activeNav === 'analytics' ? 'active' : ''}`}
            onClick={() => navigate('/analytics')}
            >
              Analytics
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
        <Routes>
          <Route path="/" element={<Dashboard athletesData={athletesData} darkMode={darkMode} setDarkMode={setDarkMode} SunIcon={SunIcon} MoonIcon={MoonIcon} />} />
          <Route path="/athletes" element={<Athletes athletesData={athletesData} darkMode={darkMode} setDarkMode={setDarkMode} SunIcon={SunIcon} MoonIcon={MoonIcon} />} />
          <Route path="/athlete/:id" element={<AthleteDetail athletesData={athletesData} />} />
          <Route path="/analytics" element={<Analytics athletesData={athletesData} darkMode={darkMode} setDarkMode={setDarkMode} SunIcon={SunIcon} MoonIcon={MoonIcon} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;