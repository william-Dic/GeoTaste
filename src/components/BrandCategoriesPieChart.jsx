import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const DEFAULT_CITY = 'London';
const DEFAULT_COUNTRY = 'GB';
const DEFAULT_LIMIT = 50;

function BrandCategoriesPieChart() {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVisualization() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/visualizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: DEFAULT_CITY, country: DEFAULT_COUNTRY, limit: DEFAULT_LIMIT })
        });
        if (!res.ok) throw new Error('Failed to fetch visualization data');
        const data = await res.json();
        if (data.brand_categories) {
          setPlotData(JSON.parse(data.brand_categories));
        } else {
          setPlotData(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVisualization();
  }, []);

  // Much better dimensions for the chart
  const CHART_HEIGHT = 225;
  const CHART_STYLE = {
    width: '180%',
    height: CHART_HEIGHT,
    minHeight: CHART_HEIGHT,
    maxHeight: CHART_HEIGHT,
    background: 'transparent',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  };

  if (loading) {
    return (
      <div style={{
        ...CHART_STYLE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00eaff',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        Loading brand categories...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        ...CHART_STYLE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f87171',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!plotData) {
    return (
      <div style={{
        ...CHART_STYLE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7f5cff',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        No brand categories data available.
      </div>
    );
  }

  // Futuristic neon color palette for pie chart
  const enhancedColors = [
    '#00eaff', // neon cyan
    '#ff00ff', // neon magenta
    '#00ff00', // neon green
    '#ffff00', // neon yellow
    '#ff0080', // neon pink
    '#00ffff', // neon aqua
    '#ff8000', // neon orange
    '#8000ff', // neon purple
    '#00ff80', // neon mint
    '#ff0080', // neon rose
  ];

  // Process and enhance the data for futuristic visualization
  const enhancedData = plotData.data.map((trace, i) => ({
    ...trace,
    marker: {
      ...trace.marker,
      colors: enhancedColors.slice(0, trace.values?.length || 8),
      line: { 
        color: '#000000',
        width: 3
      },
      opacity: 0.9,
    },
    textinfo: 'label+percent',
    textposition: 'inside',
    textfont: {
      size: 11,
      color: '#ffffff',
      family: 'Segoe UI, Roboto, Arial, sans-serif',
      weight: 'bold'
    },
    hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>',
    hole: 0.4, // Donut chart
  }));

  return (
    <Plot
      data={enhancedData}
      layout={{
        ...plotData.layout,
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { 
          color: '#ffffff', 
          family: 'Segoe UI, Roboto, Arial, sans-serif',
          size: 12
        },
        margin: { l: 20, r: 20, t: 40, b: 20 },
        height: CHART_HEIGHT,
        showlegend: true,
        legend: {
          orientation: "v",
          yanchor: "top",
          y: 1,
          xanchor: "left",
          x: 1.02,
          bgcolor: 'rgba(0,0,0,0.8)',
          bordercolor: 'rgba(255,255,255,0.2)',
          borderwidth: 1,
          font: {
            size: 10,
            color: '#ffffff',
            family: 'Segoe UI, Roboto, Arial, sans-serif'
          }
        },
        title: {
          text: 'BRAND CATEGORIES',
          font: { size: 12, color: '#ffffff', weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' },
          x: 0.5,
          y: 0.95
        },
      }}
      config={{ 
        displayModeBar: false, 
        responsive: true,
        staticPlot: false
      }}
      style={{ 
        width: '100%', 
        height: CHART_HEIGHT,
        background: 'transparent'
      }}
      useResizeHandler={true}
    />
  );
}

export default BrandCategoriesPieChart; 