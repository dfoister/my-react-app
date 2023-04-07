import React from 'react';
import './App.css';
import './AnimatedBackground';
import AnimatedBackground from "./AnimatedBackground";

function App() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }} className="App">
      <AnimatedBackground />
      <header className="App-header">
        <p>
          This is a WIP :)
        </p>
        <a
          className="App-link"
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Real Website
        </a>
      </header>
    </div>
  );
}

export default App;
