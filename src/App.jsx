import React, { useState, useEffect, useRef } from 'react';
import HomeScreen from './HomeScreen.jsx';
import MapView from './MapView.jsx';
import MainPage from './MainPage.jsx';

function App() {
  const [location, setLocation] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [fade, setFade] = useState('');
  const [mapCenter, setMapCenter] = useState();
  const [mapZoom, setMapZoom] = useState();

  // Remove previous useEffect for timer
  const handleFinish = (center, zoom) => {
    setMapCenter(center);
    setMapZoom(zoom);
    setFade('fade-out');
    setTimeout(() => {
      setShowDashboard(true);
      setFade('fade-in');
      setTimeout(() => setFade(''), 600);
    }, 600);
  };

  return location ? (
    showDashboard ? (
      <div className={fade}><MainPage mapCenter={mapCenter} mapZoom={mapZoom} /></div>
    ) : (
      <div className={fade}><MapView location={location} onFinish={handleFinish} /></div>
    )
  ) : (
    <HomeScreen onSend={setLocation} />
  );
}

// Add fade CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .fade-out { opacity: 0; transition: opacity 0.6s; }
    .fade-in { opacity: 1; transition: opacity 0.6s; }
  `;
  document.head.appendChild(style);
}

export default App; 