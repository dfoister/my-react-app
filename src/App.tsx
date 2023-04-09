import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimatedBackground from "./AnimatedBackground";
import Chess from "./Chess/Chess";

function App() {
  return (
      <Router>
      <Routes>
          <Route path="/" Component={AnimatedBackground} />
          <Route path="/chess"  Component={Chess} />
      </Routes>
      </Router>
  );
}

export default App;
