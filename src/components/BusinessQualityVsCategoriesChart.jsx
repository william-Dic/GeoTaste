import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const DEFAULT_CITY = 'London';
const DEFAULT_COUNTRY = 'GB';
const DEFAULT_LIMIT = 50;

function BusinessQualityVsCategoriesChart() {
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
        if (data.business_density) {
          setPlotData(JSON.parse(data.business_density));
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
        Loading business quality analysis...
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
        No business data available.
      </div>
    );
  }

  // Futuristic neon color palette
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
      size: 18, // Larger markers for better visibility
      color: trace.marker?.color || enhancedColors[i % enhancedColors.length],
      line: { 
        width: 3, 
        color: '#000000',
        opacity: 1
      },
      opacity: 0.9,
      symbol: 'circle',
      showscale: false, // Remove colorbar/legend
    },
    line: trace.line ? { 
      ...trace.line, 
      color: enhancedColors[i % enhancedColors.length], 
      width: 4 
    } : undefined,
    hovertemplate: '<b>%{text}</b><br>Rating: %{y:.1f}<br>Categories: %{x}<extra></extra>',
    textposition: 'top center',
    showscale: false, // Remove colorbar/legend
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
          margin: { l: 50, r: 40, t: 40, b: 60 },
          height: CHART_HEIGHT,
          showlegend: false,
        title: {
          text: 'BUSINESS QUALITY ANALYSIS',
          font: { size: 12, color: '#ffffff', weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' },
          x: 0.5,
          y: 0.95
        },
        xaxis: {
          ...plotData.layout?.xaxis,
          title: {
            text: "Number of Categories",
            font: { size: 12, color: '#ffffff', weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' },
            standoff: 15
          },
          showgrid: false,
          zeroline: false,
          tickfont: { size: 10, color: '#ffffff', weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' },
          linecolor: '#ffffff',
          linewidth: 2,
          mirror: false,
          showticklabels: true,
          tickmode: 'auto',
          nticks: 8,
        },
        yaxis: {
          ...plotData.layout?.yaxis,
          title: {
            text: "Business Rating",
            font: { size: 12, color: '#ffffff', weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' },
            standoff: 15
          },
          showgrid: false,
          zeroline: false,
          tickfont: { size: 10, color: '#ffffff', weight: 'bold', family: 'Segoe UI, Roboto, Arial, sans-serif' },
          linecolor: '#ffffff',
          linewidth: 2,
          mirror: false,
          showticklabels: true,
          tickmode: 'auto',
          nticks: 6,
          range: [3.5, 5], // Focus on ratings between 3.5-5
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

export default BusinessQualityVsCategoriesChart; 