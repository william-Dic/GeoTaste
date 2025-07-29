import React, { useState, useRef, useEffect } from 'react';

// Add debugging
console.log('🚀 App.jsx is loading...');

function App() {
  console.log('🎯 App component is rendering...');
  
  const [testState, setTestState] = useState('Initial State');

  // Add useEffect for debugging
  useEffect(() => {
    console.log('✅ App component mounted successfully');
    console.log('🔧 Environment check:');
    console.log('  - Window location:', window.location.href);
    console.log('  - User agent:', navigator.userAgent);
    console.log('  - React version:', React.version);
  }, []);

  console.log('🎨 App component is about to render JSX...');
  
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{ 
          color: 'white', 
          margin: '0 0 10px 0',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🌍 GeoTaste
        </h1>
        <p style={{ 
          color: 'white', 
          margin: 0,
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          AI Agentic Business Environment Consultant
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '600px',
        width: '100%',
        color: '#333'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '2rem',
          color: '#667eea'
        }}>
          🎉 React App is Working!
        </h2>
        
        <div style={{
          margin: '20px 0',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '10px',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Component Status:</h3>
          <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>✅ App.jsx - Working</p>
          <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>✅ React State - Working</p>
          <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>✅ useEffect - Working</p>
          <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>✅ Inline Styles - Working</p>
        </div>

        <div style={{
          margin: '20px 0',
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '10px',
          border: '2px solid #2196f3'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>State Test:</h3>
          <p style={{ margin: '5px 0', color: '#1976d2' }}>Current State: <strong>{testState}</strong></p>
        </div>
        
        <button 
          onClick={() => {
            console.log('✅ Button clicked - React is working!');
            setTestState('Button Clicked! - ' + new Date().toLocaleTimeString());
            alert('React is working perfectly! 🎉\nState updated successfully!');
          }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          🚀 Test React Functionality
        </button>

        <div style={{
          margin: '20px 0 0 0',
          padding: '10px',
          background: '#fff3cd',
          borderRadius: '5px',
          border: '1px solid #ffeaa7'
        }}>
          <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
            <strong>Debug Info:</strong> If you can see this text, React is rendering properly!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '14px'
      }}>
        <p style={{ margin: 0 }}>React Version: {React.version}</p>
        <p style={{ margin: '5px 0 0 0' }}>Window Size: {window.innerWidth} x {window.innerHeight}</p>
      </div>
    </div>
  );
}

export default App;