import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DEFAULT_CITY = 'London';
const DEFAULT_COUNTRY = 'GB';
const DEFAULT_LIMIT = 50;

function PlaceRatingsChart() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRatings() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/visualizations/place_ratings_data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: DEFAULT_CITY, country: DEFAULT_COUNTRY, limit: DEFAULT_LIMIT })
        });
        if (!res.ok) throw new Error('Failed to fetch ratings data');
        const data = await res.json();
        setRatings(data.ratings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRatings();
  }, []);

  // Bin ratings into histogram (e.g., 3.0-3.5, 3.5-4.0, ..., 4.5-5.0)
  const binSize = 0.5;
  const minRating = 3.0;
  const maxRating = 5.0;
  const bins = [];
  const binLabels = [];
  for (let b = minRating; b < maxRating; b += binSize) {
    bins.push(0);
    binLabels.push(`${b.toFixed(1)}–${(b + binSize).toFixed(1)}`);
  }
  ratings.forEach(r => {
    if (r >= minRating && r <= maxRating) {
      const idx = Math.min(Math.floor((r - minRating) / binSize), bins.length - 1);
      if (idx >= 0 && idx < bins.length) bins[idx]++;
    }
  });

  const data = {
    labels: binLabels,
    datasets: [
      {
        label: 'Number of Places',
        data: bins,
        backgroundColor: '#4ECDC4',
        borderRadius: 6,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        title: { display: true, text: 'Rating', color: '#34495e', font: { size: 14 } },
        ticks: { color: '#34495e', font: { size: 12 } },
        grid: { color: 'rgba(0,0,0,0.07)' },
      },
      y: {
        title: { display: true, text: 'Number of Places', color: '#34495e', font: { size: 14 } },
        ticks: { color: '#34495e', font: { size: 12 } },
        grid: { color: 'rgba(0,0,0,0.07)' },
        beginAtZero: true,
      },
    },
  };

  const FIXED_HEIGHT = 150; // Reduced height for better visibility of title and axes
  const FIXED_STYLE = {
    width: '100%',
    height: FIXED_HEIGHT,
    minHeight: FIXED_HEIGHT,
    maxHeight: FIXED_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    marginTop: '1.2rem',
  };

  if (loading) return <div style={FIXED_STYLE}>Loading place ratings distribution...</div>;
  if (error) return <div style={{ ...FIXED_STYLE, color: '#f87171' }}>Error: {error}</div>;
  if (!ratings.length) return <div style={FIXED_STYLE}>No data to display.</div>;

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        textAlign: 'center',
        color: '#fff', // White font color for the title
        fontWeight: 700,
        fontSize: '1rem', // Smaller title font
        letterSpacing: '0.04em',
        marginBottom: '0.7rem',
        fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
        textTransform: 'uppercase',
      }}>
        Business Ratings
      </div>
      <div style={FIXED_STYLE}>
        <Bar data={{
          ...data,
          datasets: [
            {
              ...data.datasets[0],
              backgroundColor: function(context) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) return '#0ff';
                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                gradient.addColorStop(0, '#0ff');
                gradient.addColorStop(0.5, '#38bdf8');
                gradient.addColorStop(1, '#818cf8');
                return gradient;
              },
              borderColor: '#67e8f9',
              borderWidth: 2,
              borderRadius: 8,
              barPercentage: 0.85,
              categoryPercentage: 0.85,
              hoverBackgroundColor: '#fff',
              hoverBorderColor: '#0ff',
            },
          ],
        }} options={{
          ...options,
          plugins: {
            ...options.plugins,
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: '#18181b',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#0ff',
              borderWidth: 1,
              caretPadding: 8,
              padding: 12,
              displayColors: false,
              titleFont: { size: 12 },
              bodyFont: { size: 11 },
              font: { family: 'Segoe UI, Roboto, Arial, sans-serif' },
            },
          },
          scales: {
            x: {
              ...options.scales.x,
              title: { ...options.scales.x.title, color: '#fff', font: { size: 12, weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' } },
              ticks: { ...options.scales.x.ticks, color: '#fff', font: { size: 10, weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' } },
              grid: { ...options.scales.x.grid, display: false }, // Remove grid
            },
            y: {
              ...options.scales.y,
              title: { ...options.scales.y.title, color: '#fff', font: { size: 12, weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' } },
              ticks: { ...options.scales.y.ticks, color: '#fff', font: { size: 10, weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' } },
              grid: { ...options.scales.y.grid, display: false }, // Remove grid
            },
          },
        }} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

export default PlaceRatingsChart; 