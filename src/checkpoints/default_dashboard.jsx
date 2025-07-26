import React from 'react';

const NUM_ROWS = 3;
const NUM_COLS = 6;
const cards = Array.from({ length: NUM_ROWS * NUM_COLS }, (_, i) => i + 1);

function MainPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #18181b 0%, #23272f 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
      }}
    >
      {/* Navigation Bar Placeholder */}
      <div
        style={{
          height: '64px',
          minHeight: '64px',
          width: '100%',
          background: 'rgba(24,24,27,0.95)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2.5rem',
          boxSizing: 'border-box',
          borderBottom: '1px solid #23272f',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ color: '#60a5fa', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.04em' }}>
          GeoTaste Dashboard
        </span>
      </div>
      {/* Main Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.2fr 1.2fr 1.2fr 0.8fr 0.8fr',
          gridAutoRows: '220px',
          columnGap: '2.5rem',
          rowGap: '2.5rem',
          width: '100%',
          padding: '2.5rem',
          boxSizing: 'border-box',
        }}
      >
        {cards.map((num) => (
          <div
            key={num}
            style={{
              background: 'linear-gradient(120deg, #23272f 60%, #23272f 100%)',
              borderRadius: '1.2rem',
              boxShadow: '0 6px 32px #0ea5e933, 0 1.5px 8px #0008',
              padding: '2rem 1.2rem',
              minHeight: 220,
              height: 220,
              maxHeight: 220,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f3f4f6',
              fontWeight: 600,
              fontSize: '1.2rem',
              letterSpacing: '0.01em',
              transition: 'box-shadow 0.2s',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            Card {num}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div
        style={{
          height: '38px',
          minHeight: '38px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(24,24,27,0.97)',
          borderTop: '1px solid #23272f',
        }}
      >
        <span style={{ color: '#a1a1aa', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
          GeoTaste - Entry to QLoo Global Hackathon
        </span>
      </div>
    </div>
  );
}

export default MainPage;