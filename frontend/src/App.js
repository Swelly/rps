import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Game from './Game';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Welcome to the Rock, Paper, Scissors Game</h1>
          <nav>
            <ul>
              <li>
                <Link to="/game">Play the Game</Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="intro">
          <h2>Rules of the Game</h2>
          <p>Rules explanation...</p>
        </div>
        <Routes>
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
