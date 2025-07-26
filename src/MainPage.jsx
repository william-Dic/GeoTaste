import React, { useEffect, useRef } from 'react';
import Map from './components/Map.jsx';
import InsightsChart from './components/PlaceRatingsChart.jsx';
import BusinessQualityVsCategoriesChart from './components/BusinessQualityVsCategoriesChart.jsx';

const NUM_ROWS = 3;
const NUM_COLS = 6;
const cards = Array.from({ length: NUM_ROWS * NUM_COLS }, (_, i) => i + 1);

function MainPage({ mapCenter, mapZoom }) {
  const particleCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let animationFrameId;

    const numParticles = 60;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 1.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: 0.5 + Math.random() * 0.5
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={particleCanvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Navigation Bar Placeholder */}
      <div
        style={{
          height: '64px',
          minHeight: '64px',
          width: '100%',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2.5rem',
          boxSizing: 'border-box',
          borderBottom: '1px solid #23272f',
          marginBottom: '1.5rem',
          zIndex: 1,
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
          gridAutoRows: 'minmax(220px, 1fr)', // Ensures a minimum and max height for rows
          columnGap: '2.5rem',
          rowGap: '2.5rem',
          width: '100%',
          height: '100%', // Ensures grid fills available space
          padding: '2.5rem',
          boxSizing: 'border-box',
          zIndex: 1,
        }}
      >
        {/* Fused card spanning positions 1, 2, 7, 8 */}
        <div
          className="dashboard-card dashboard-map-card"
          style={{
            background: 'linear-gradient(120deg, #23272f 60%, #23272f 100%)',
            borderRadius: '1.2rem',
            boxShadow: '0 6px 32px #0ea5e933, 0 1.5px 8px #0008',
            padding: 0,
            minHeight: 0,
            minWidth: 0,
            maxHeight: '100%',
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            color: '#f3f4f6',
            fontWeight: 600,
            fontSize: '1.2rem',
            letterSpacing: '0.01em',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            gridColumn: '1 / 3',
            gridRow: '1 / 3',
            overflow: 'hidden',
            position: 'relative',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
        >
          <Map setMap={() => {}} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} initialCenter={mapCenter} initialZoom={mapZoom} markerCoords={mapCenter} dashboardMode={true} />
        </div>
        {/* Cards 3 and 4 */}
        {cards.slice(2, 4).map((num, idx) => (
          <div
            key={num}
            className="dashboard-card"
            style={{
              background: 'linear-gradient(120deg, #23272f 60%, #23272f 100%)',
              borderRadius: '1.2rem',
              boxShadow: '0 6px 32px #0ea5e933, 0 1.5px 8px #0008',
              padding: '2rem 1.2rem',
              minHeight: 220,
              height: 220,
              maxHeight: 220,
              minWidth: 0,
              maxWidth: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f3f4f6',
              fontWeight: 600,
              fontSize: '1.2rem',
              letterSpacing: '0.01em',
              boxSizing: 'border-box',
              overflow: 'hidden',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
          >
            {idx === 0 ? <InsightsChart /> : <BusinessQualityVsCategoriesChart />}
          </div>
        ))}
        {/* Fused card spanning positions 5, 6, 11, 12, 17, 18 */}
        <div
          className="dashboard-card"
          style={{
            background: 'linear-gradient(120deg, #23272f 60%, #23272f 100%)',
            borderRadius: '1.2rem',
            boxShadow: '0 6px 32px #0ea5e933, 0 1.5px 8px #0008',
            padding: '2rem 1.2rem',
            minHeight: 0,
            minWidth: 0,
            maxHeight: '100%',
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f3f4f6',
            fontWeight: 600,
            fontSize: '1.2rem',
            letterSpacing: '0.01em',
            height: '100%',
            width: '100%',
            boxSizing: 'border-box',
            gridColumn: '5 / 7',
            gridRow: '1 / 4',
            overflow: 'auto',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
        >
          AgentChatbox
        </div>
        {/* Cards 9 and 10 */}
        {cards.slice(8, 10).map((num) => (
          <div
            key={num}
            className="dashboard-card"
            style={{
              background: 'linear-gradient(120deg, #23272f 60%, #23272f 100%)',
              borderRadius: '1.2rem',
              boxShadow: '0 6px 32px #0ea5e933, 0 1.5px 8px #0008',
              padding: '2rem 1.2rem',
              minHeight: 0,
              minWidth: 0,
              maxHeight: '100%',
              maxWidth: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f3f4f6',
              fontWeight: 600,
              fontSize: '1.2rem',
              letterSpacing: '0.01em',
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
          >
            Card {num}
          </div>
        ))}
        {/* Cards 13, 14, 15, 16 */}
        {cards.slice(12, 16).map((num) => (
          <div
            key={num}
            className="dashboard-card"
            style={{
              background: 'linear-gradient(120deg, #23272f 60%, #23272f 100%)',
              borderRadius: '1.2rem',
              boxShadow: '0 6px 32px #0ea5e933, 0 1.5px 8px #0008',
              padding: '2rem 1.2rem',
              minHeight: 0,
              minWidth: 0,
              maxHeight: '100%',
              maxWidth: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f3f4f6',
              fontWeight: 600,
              fontSize: '1.2rem',
              letterSpacing: '0.01em',
              height: '100%',
              width: '100%',
              boxSizing: 'border-box',
              transition: 'box-shadow 0.2s, transform 0.2s',
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
          background: '#000',
          borderTop: '1px solid #23272f',
        }}
      >
        <span style={{ color: '#a1a1aa', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
          GeoTaste - Entry to QLoo Global Hackathon
        </span>
      </div>
      {/* Neon card hover effect */}
      <style>{`
        .dashboard-card {
          transition: box-shadow 0.28s cubic-bezier(.4,2,.3,1), transform 0.28s cubic-bezier(.4,2,.3,1);
          will-change: box-shadow, transform;
        }
        .dashboard-card:hover {
          box-shadow:
            0 0 80px 24px #00e6ffcc,
            0 0 120px 48px #38bdf8cc,
            0 0 0 16px #38bdf8aa,
            0 12px 64px 0 #00e6ffcc,
            0 6px 32px #0ea5e933,
            0 1.5px 8px #0008;
          transform: translateY(-16px) scale(1.07);
          z-index: 2;
        }
      `}</style>
    </div>
  );
}

export default MainPage;