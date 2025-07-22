import React, { useState, useRef } from 'react';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import DataVisualizations from './components/DataVisualizations';
import { styled } from '@mui/material/styles';

const AppContainer = styled('div')({
  position: 'relative',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
});

const TopContainer = styled('div')({
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const FloatingVisualizationPanel = styled('div')({
  position: 'absolute',
  top: '100px',
  right: '20px',
  width: '450px',
  maxHeight: 'calc(100vh - 140px)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  zIndex: 2,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'translateX(0)',
  '&.hidden': {
    transform: 'translateX(470px)',
  },
});

const CloseButton = styled('button')({
  position: 'absolute',
  top: '15px',
  right: '15px',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#333',
  fontSize: '18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  },
});

const MinimizeButton = styled('button')({
  position: 'absolute',
  top: '15px',
  right: '55px',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#333',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)',
  },
});

const CityIndicator = styled('div')({
  position: 'absolute',
  top: '15px',
  left: '20px',
  backgroundColor: 'rgba(74, 111, 165, 0.9)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  zIndex: 3,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
});

const AgentStatusIndicator = styled('div')({
  position: 'absolute',
  top: '60px',
  left: '20px',
  backgroundColor: 'rgba(78, 205, 196, 0.9)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '600',
  zIndex: 3,
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.7 },
    '100%': { opacity: 1 },
  },
});

function App() {
  const [map, setMap] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showVisualizations, setShowVisualizations] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mapRef = useRef(null);

  const handleSearchStart = () => {
    setIsAnalyzing(true);
  };

  const handleCitySearch = (cityName, countryCode, cityCenter) => {
    setSelectedCity({ name: cityName, country: countryCode });
    setShowVisualizations(true);
    setIsMinimized(false);
    
    // Start the GeoTaste Agent animation
    if (mapRef.current) {
      mapRef.current.startAnalysisAnimation(cityCenter, cityName);
    }
  };

  const handleCloseVisualizations = () => {
    setShowVisualizations(false);
    setSelectedCity(null);
    setIsAnalyzing(false);
    
    // Stop the agent animation
    if (mapRef.current) {
      mapRef.current.stopAnalysisAnimation();
    }
  };

  const handleMinimizeVisualizations = () => {
    setIsMinimized(!isMinimized);
  };

  const handleVisualizationsReady = () => {
    setIsAnalyzing(false);
    
    // Stop the agent animation when visualizations are ready
    if (mapRef.current) {
      mapRef.current.stopAnalysisAnimation();
    }
  };

  return (
    <AppContainer>
      <TopContainer>
        <SearchBar
          map={map}
          onCitySearch={handleCitySearch}
          onSearchStart={handleSearchStart}
        />
      </TopContainer>

      <Map ref={mapRef} setMap={setMap} />

      {selectedCity && (
        <CityIndicator>
          📍 {selectedCity.name}, {selectedCity.country}
        </CityIndicator>
      )}

      {isAnalyzing && (
        <AgentStatusIndicator>
          🤖 GeoTaste Agent is analyzing...
        </AgentStatusIndicator>
      )}

      {showVisualizations && selectedCity && (
        <FloatingVisualizationPanel className={isMinimized ? 'hidden' : ''}>
          <CloseButton onClick={handleCloseVisualizations}>
            ×
          </CloseButton>
          <MinimizeButton onClick={handleMinimizeVisualizations}>
            {isMinimized ? '□' : '−'}
          </MinimizeButton>
          <DataVisualizations
            key={`${selectedCity.name}-${selectedCity.country}`}
            cityName={selectedCity.name}
            countryCode={selectedCity.country}
            isCompact={true}
            onReady={handleVisualizationsReady}
          />
        </FloatingVisualizationPanel>
      )}
    </AppContainer>
  );
}

export default App;
