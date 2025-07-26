import React, { useState } from 'react';

function HomeScreen({ onSend }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSend = () => {
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }
    setError('');
    onSend(location.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
      fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 24,
        boxShadow: '0 2px 16px #0002',
        padding: '2.5rem 2.5rem',
        minWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <h2 style={{ color: '#23272f', fontWeight: 700, fontSize: '2rem', marginBottom: 8 }}>Enter a Location</h2>
        <input
          type="text"
          placeholder="e.g. Paris, New York, Tokyo"
          value={location}
          onChange={e => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            border: '1.5px solid #a1a1aa',
            outline: 'none',
            fontSize: '1.1rem',
            padding: '0.7rem 1.2rem',
            borderRadius: 16,
            width: 220,
            background: '#f3f4f6',
            marginBottom: 8,
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: 'linear-gradient(90deg, #0ea5e9 0%, #6366f1 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '0.7rem 2.2rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          Send
        </button>
        {error && <div style={{ color: '#e11d48', fontWeight: 500 }}>{error}</div>}
      </div>
    </div>
  );
}

export default HomeScreen; 