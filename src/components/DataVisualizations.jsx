import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Grid, Box, CircularProgress } from '@mui/material';

const VisualizationContainer = styled(Paper)(({ theme, isCompact }) => ({
  padding: isCompact ? theme.spacing(2) : theme.spacing(3),
  margin: isCompact ? theme.spacing(1) : theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(18px)',
  borderRadius: isCompact ? 16 : 20,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  minWidth: isCompact ? 320 : 400,
  maxWidth: isCompact ? 400 : 500,
  height: isCompact ? '320px' : '450px',
  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  '&:hover': {
    transform: isCompact ? 'translateY(-2px)' : 'translateY(-4px) scale(1.01)',
    boxShadow: isCompact ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 24px 64px rgba(0, 0, 0, 0.22)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  overflow: 'hidden',
}));

const ChartContainer = styled(Box)(({ theme, isCompact }) => ({
  height: isCompact ? '220px' : '320px',
  width: '100%',
  marginBottom: theme.spacing(1),
  borderRadius: isCompact ? 10 : 14,
  overflow: 'hidden',
  position: 'relative',
  flex: 1,
  '& .js-plotly-plot': {
    width: '100% !important',
    height: '100% !important',
  },
  '& .plotly': {
    width: '100% !important',
    height: '100% !important',
  },
  '& .plot-container': {
    width: '100% !important',
    height: '100% !important',
  },
}));

const TitleContainer = styled(Box)(({ theme, isCompact }) => ({
  textAlign: 'center',
  marginBottom: isCompact ? theme.spacing(1) : theme.spacing(2),
  padding: isCompact ? theme.spacing(1.5) : theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(74, 111, 165, 0.1) 0%, rgba(74, 111, 165, 0.05) 100%)',
  borderRadius: isCompact ? 12 : 16,
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(74, 111, 165, 0.1)',
}));

const CardHeader = styled(Typography)(({ theme, isCompact }) => ({
  fontWeight: 700,
  fontSize: isCompact ? '1rem' : '1.2rem',
  color: '#26324B',
  marginBottom: theme.spacing(0.5),
  letterSpacing: 0.2,
  lineHeight: 1.2,
}));

const CardSub = styled(Typography)(({ theme, isCompact }) => ({
  color: '#7f8c8d',
  fontSize: isCompact ? '0.75rem' : '0.9rem',
  marginBottom: isCompact ? theme.spacing(0.5) : theme.spacing(1),
  fontStyle: 'italic',
  lineHeight: 1.3,
}));

const DataVisualizations = ({ cityName, countryCode, isCompact = false, onReady }) => {
  const [visualizations, setVisualizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cityName || !countryCode) return;

    const generateVisualizations = async () => {
      setLoading(true);
      setError(null);
      // Clear old visualizations immediately when starting new search
      setVisualizations(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('http://localhost:5000/api/visualizations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            city: cityName,
            country: countryCode,
            limit: 20
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setVisualizations(data);
        
        // Notify parent that visualizations are ready
        if (onReady) {
          onReady();
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timed out. The backend is taking longer than expected to generate visualizations.');
        } else {
          setError(err.message);
        }
        console.error('Error generating visualizations:', err);
        
        // Notify parent even on error
        if (onReady) {
          onReady();
        }
      } finally {
        setLoading(false);
      }
    };
    generateVisualizations();
  }, [cityName, countryCode, onReady]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={isCompact ? "200px" : "400px"}>
        <CircularProgress size={isCompact ? 40 : 60} sx={{ color: '#4ECDC4' }} />
        <Typography variant={isCompact ? "body1" : "h6"} sx={{ color: '#4a6fa5', mt: 2, textAlign: 'center' }}>
          Generating Business Insights...
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(74, 111, 165, 0.7)', mt: 1, textAlign: 'center' }}>
          Analyzing data for {cityName}, {countryCode}
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(74, 111, 165, 0.5)', mt: 1, textAlign: 'center' }}>
          This may take up to 30 seconds
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={isCompact ? "200px" : "400px"}>
        <Typography variant={isCompact ? "body1" : "h6"} sx={{ color: '#e74c3c', textAlign: 'center', mb: 2 }}>
          Error: {error}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(74, 111, 165, 0.7)', textAlign: 'center' }}>
          Please try searching for a different city or check your connection.
        </Typography>
      </Box>
    );
  }

  if (!visualizations) {
    return null;
  }

  const getPlotConfig = (hideLegend = false) => ({
    displayModeBar: false,
    responsive: true,
    showlegend: !hideLegend,
    staticPlot: false,
    editable: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
  });

  const getEnhancedLayout = (layout, hideLegend = false) => ({
    ...layout,
    title: '',
    autosize: true,
    margin: isCompact ? { l: 50, r: 20, t: 15, b: 30 } : { l: 70, r: 30, t: 20, b: 40 },
    font: {
      family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      size: isCompact ? 10 : 14,
      color: '#2c3e50'
    },
    paper_bgcolor: 'rgba(255, 255, 255, 0)',
    plot_bgcolor: 'rgba(255, 255, 255, 0)',
    xaxis: {
      ...layout.xaxis,
      gridcolor: 'rgba(0, 0, 0, 0.13)',
      zeroline: false,
      showline: true,
      linecolor: 'rgba(0, 0, 0, 0.18)',
      tickfont: {
        size: isCompact ? 9 : 12,
        color: '#34495e',
        family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      title: {
        ...layout.xaxis?.title,
        font: { size: isCompact ? 11 : 15, color: '#26324B', family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' },
      },
      tickangle: layout.xaxis?.tickangle || 0,
      fixedrange: true,
    },
    yaxis: {
      ...layout.yaxis,
      gridcolor: 'rgba(0, 0, 0, 0.13)',
      zeroline: false,
      showline: true,
      linecolor: 'rgba(0, 0, 0, 0.18)',
      tickfont: {
        size: isCompact ? 9 : 12,
        color: '#34495e',
        family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      title: {
        ...layout.yaxis?.title,
        font: { size: isCompact ? 11 : 15, color: '#26324B', family: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' },
      },
      fixedrange: true,
    },
    showlegend: !hideLegend,
    legend: hideLegend ? undefined : {
      orientation: "v",
      yanchor: "top",
      y: 1,
      xanchor: "left",
      x: 1.02,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: 'rgba(0,0,0,0.1)',
      borderwidth: 1,
      font: { size: isCompact ? 8 : 10 }
    },
    dragmode: false,
    hovermode: 'closest',
    height: isCompact ? 220 : 320,
    width: isCompact ? 320 : 400,
  });

  const renderCard = (header, subtitle, chartData, hideLegend = false) => {
    if (!chartData) return null;
    try {
      const plotData = JSON.parse(chartData);
      return (
        <VisualizationContainer isCompact={isCompact}>
          <CardHeader isCompact={isCompact}>{header}</CardHeader>
          <CardSub isCompact={isCompact}>{subtitle}</CardSub>
          <ChartContainer isCompact={isCompact}>
            <Plot
              data={plotData.data}
              layout={getEnhancedLayout(plotData.layout, hideLegend)}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
              config={getPlotConfig(hideLegend)}
              onInitialized={() => {}}
              onUpdate={() => {}}
              onPurge={() => {}}
            />
          </ChartContainer>
        </VisualizationContainer>
      );
    } catch (err) {
      console.error('Error parsing chart data:', err);
      return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: isCompact ? 1 : 2, overflow: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
      <TitleContainer isCompact={isCompact}>
        <Typography variant={isCompact ? "h6" : "h4"} gutterBottom sx={{
          color: '#4a6fa5',
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          mb: 1,
          fontSize: isCompact ? '1.1rem' : '1.5rem'
        }}>
          {isCompact ? `Business Insights` : `Business Insights for ${cityName}`}
        </Typography>
        <Typography variant={isCompact ? "body2" : "h6"} sx={{
          color: 'rgba(74, 111, 165, 0.8)',
          fontWeight: 400,
          fontSize: isCompact ? '0.8rem' : '1rem'
        }}>
          {isCompact ? `Discover the business landscape` : `Discover the business landscape and brand preferences`}
        </Typography>
      </TitleContainer>

      <Grid container spacing={isCompact ? 1 : 2} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Business Quality vs. Categories',
            'How business diversity relates to ratings',
            visualizations.business_density,
            true
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Business Activity Patterns',
            'When businesses are most active',
            visualizations.business_hours,
            true
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Price Range Distribution',
            'Affordability spectrum of local businesses',
            visualizations.price_range
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Place Categories',
            'Types of businesses in the area',
            visualizations.place_categories
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Place Ratings Distribution',
            'Quality assessment of local businesses',
            visualizations.place_ratings,
            true
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Brand Popularity',
            'Most popular brands in this city',
            visualizations.brand_popularity,
            true
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3} display="flex">
          {renderCard(
            'Brand Categories',
            'Distribution of brand types',
            visualizations.brand_categories
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataVisualizations; 