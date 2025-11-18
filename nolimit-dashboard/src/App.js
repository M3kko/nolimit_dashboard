import React from 'react';
import './App.css';

const athletesData = [
  {
  id: 1,
  name: "Alexander",
  sport: "Track & field",
  weeklyProgress: 94,
  sessions: 12,
  },
  {
  id: 2,
  name: "Natalie",
  sport: "Swimming",
  weeklyProgress: 88,
  sessions: 10,
  },
]


function App() {
  return (
    <div className="App"> 
      <header className="dashboard-header">
        <h1>Athlete Performance</h1>
        <p className="subtitle">Overview of your team's progress and metrics</p>
      </header>

    </div>
  );
}

export default App;