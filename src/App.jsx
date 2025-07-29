import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';

// Add debugging
console.log('🚀 App.jsx is loading...');

const AppContainer = styled('div')({
  position: 'relative',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

const TestUI = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: '40px',
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  maxWidth: '600px',
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
        <h1 style={{ color: 'white', margin: 0 }}>🌍 GeoTaste</h1>
        <p style={{ color: 'white', margin: 0 }}>AI Agentic Business Environment Consultant</p>
      </TopContainer>

      <TestUI>
        <h2>🎉 React App is Working!</h2>
        <p>✅ App component loaded successfully</p>
        <p>✅ Styled components working</p>
        <p>✅ State management working</p>
        
        <div style={{ margin: '20px 0', padding: '15px', background: '#f0f0f0', borderRadius: '10px' }}>
          <h3>Component Status:</h3>
          <p>✅ App.jsx - Working</p>
          <p>✅ Styled Components - Working</p>
          <p>✅ React State - Working</p>
          <p>✅ useEffect - Working</p>
        </div>
        
        <button 
          onClick={() => {
            console.log('✅ Button clicked - React is working!');
            alert('React is working perfectly! 🎉');
          }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test React Functionality
        </button>
      </TestUI>
    </AppContainer>
  );
}

export default App;