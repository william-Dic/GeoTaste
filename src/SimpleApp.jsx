import React, { useState, useEffect } from 'react';

function SimpleApp() {
  const [apiStatus, setApiStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Test API connectivity
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        console.log('✅ API Health Check:', data);
        setApiStatus(`API Status: ${data.status}`);
      })
      .catch(err => {
        console.error('❌ API Health Check Error:', err);
        setError(err.message);
        setApiStatus('API Error');
      });
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1>🌍 GeoTaste - Simple Test</h1>
        <p>React app is working! 🎉</p>
        
        <div style={{
          margin: '20px 0',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '10px'
        }}>
          <h3>API Status:</h3>
          <p>{apiStatus}</p>
          {error && (
            <p style={{ color: '#ff6b6b' }}>
              Error: {error}
            </p>
          )}
        </div>

        <div style={{
          margin: '20px 0',
          padding: '15px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '10px'
        }}>
          <h3>Environment Check:</h3>
          <p>React Version: {React.version}</p>
          <p>Current URL: {window.location.href}</p>
          <p>User Agent: {navigator.userAgent}</p>
        </div>

        <button 
          onClick={() => {
            console.log('✅ Button clicked - React is working!');
            alert('React is working perfectly! 🎉');
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
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
      </div>
    </div>
  );
}

export default SimpleApp; 