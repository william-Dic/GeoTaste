import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import DataVisualizations from './components/DataVisualizations';
import BusinessAnalysisPanel from './components/BusinessAnalysisPanel';

// Add debugging
console.log('🚀 App.jsx is loading...');
console.log('✅ All components imported successfully');

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

const AnalysisLayout = styled('div')({
  position: 'absolute',
  top: '100px',
  left: '20px',
  right: '20px',
  bottom: '20px',
  display: 'flex',
  gap: '20px',
  zIndex: 2,
  justifyContent: 'space-between',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'translateX(0)',
  '&.hidden': {
    transform: 'translateX(100%)',
  },
});

const LeftPanel = styled('div')({
  width: '45%',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const RightPanel = styled('div')({
  width: '55%',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

const MinimizeButton = styled('button')({
  position: 'absolute',
  top: '15px',
  right: '15px',
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
  console.log('🎯 App component is rendering...');
  
  const [map, setMap] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [visualizationsReady, setVisualizationsReady] = useState(false);
  const [gptAnalysisReady, setGptAnalysisReady] = useState(false);
  const mapRef = useRef(null);

  // Add useEffect for debugging
  useEffect(() => {
    console.log('✅ App component mounted successfully');
    console.log('🔧 Environment check:');
    console.log('  - Window location:', window.location.href);
    console.log('  - User agent:', navigator.userAgent);
    console.log('  - React version:', React.version);
  }, []);

  const handleSearchStart = () => {
    console.log('[App] 🔍 Search started - resetting states');
    setIsAnalyzing(true);
    setVisualizationsReady(false);
    setGptAnalysisReady(false);
    setShowAnalysis(false);
  };

  const handleCitySearch = (cityName, countryCode, cityCenter) => {
    console.log(`[App] 🏙️ City search: ${cityName}, ${countryCode}`);
    setSelectedCity({ name: cityName, country: countryCode });
    setIsMinimized(false);
    
    // Start the GeoTaste Agent animation
    if (mapRef.current) {
      mapRef.current.startAnalysisAnimation(cityCenter, cityName);
    }
  };

  const handleCloseAnalysis = () => {
    console.log('[App] ❌ Closing analysis');
    setShowAnalysis(false);
    setSelectedCity(null);
    setIsAnalyzing(false);
    setVisualizationsReady(false);
    setGptAnalysisReady(false);
    
    // Stop the agent animation
    if (mapRef.current) {
      mapRef.current.stopAnalysisAnimation();
    }
  };

  const handleVisualizationsReady = () => {
    console.log('[App] 📊 Visualizations ready');
    setVisualizationsReady(true);
    checkIfReadyToShow();
    
    // Stop the agent animation when visualizations are ready
    if (mapRef.current) {
      mapRef.current.stopAnalysisAnimation();
    }
  };

  const handleGptAnalysisReady = () => {
    console.log('[App] 🤖 GPT Analysis ready');
    setGptAnalysisReady(true);
    checkIfReadyToShow();
  };

  const checkIfReadyToShow = () => {
    console.log(`[App] 🔍 Checking if ready to show: viz=${visualizationsReady}, gpt=${gptAnalysisReady}`);
    if (visualizationsReady && gptAnalysisReady) {
      console.log('[App] ✅ Both ready - showing analysis panels');
      setShowAnalysis(true);
      setIsAnalyzing(false);
    } else {
      console.log(`[App] ⏳ Still waiting: viz=${visualizationsReady}, gpt=${gptAnalysisReady}`);
    }
  };

  const handleMinimizeAnalysis = () => {
    setIsMinimized(!isMinimized);
  };

  console.log('🎨 App component is about to render JSX...');
  
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

      {selectedCity && (
        <AnalysisLayout 
          className={isMinimized ? 'hidden' : ''} 
          style={{ 
            opacity: showAnalysis ? 1 : 0,
            pointerEvents: showAnalysis ? 'auto' : 'none',
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          {/* Left Panel - Business Environment Analysis */}
          <LeftPanel>
            <BusinessAnalysisPanel 
              cityName={selectedCity.name}
              countryCode={selectedCity.country}
              onAnalysisReady={handleGptAnalysisReady}
            />
          </LeftPanel>

          {/* Right Panel - Data Visualizations */}
          <RightPanel>
            <MinimizeButton onClick={handleMinimizeAnalysis}>
            {isMinimized ? '□' : '−'}
          </MinimizeButton>
          <DataVisualizations
            key={`${selectedCity.name}-${selectedCity.country}`}
            cityName={selectedCity.name}
            countryCode={selectedCity.country}
              isCompact={false}
            onReady={handleVisualizationsReady}
          />
          </RightPanel>
        </AnalysisLayout>
      )}
    </AppContainer>
  );
}

export default App;