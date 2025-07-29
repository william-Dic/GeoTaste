import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Paper, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HotelIcon from '@mui/icons-material/Hotel';
import AttractionsIcon from '@mui/icons-material/Attractions';
import InfoIcon from '@mui/icons-material/Info';

// Dynamic import for Plotly to avoid build issues
let Plot = null;
let Plotly = null;

// Simple fallback component
const FallbackChart = ({ data, layout, config, ...props }) => (
  <div 
    style={{ 
      width: '100%', 
      height: '400px', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #ccc',
      borderRadius: '8px',
      flexDirection: 'column',
      gap: '8px'
    }}
    {...props}
  >
    <Typography variant="body2" color="textSecondary">
      Chart loading... (Plotly temporarily unavailable)
    </Typography>
    <Typography variant="caption" color="textSecondary">
      Retrying connection...
    </Typography>
  </div>
);

// Initialize with fallback
Plot = FallbackChart;

// Try to load Plotly dynamically
const loadPlotly = async () => {
  try {
    console.log('🔄 Loading Plotly...');
    
    // Try loading from CDN first
    if (typeof window !== 'undefined' && !window.Plotly) {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      // Wait a bit for Plotly to initialize
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Now try to import react-plotly.js
    const plotlyModule = await import('react-plotly.js');
    Plot = plotlyModule.default;
    Plotly = window.Plotly;
    
    console.log('✅ Plotly loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to load Plotly:', error);
    // Use the fallback component
    Plot = FallbackChart;
    return false;
  }
};

// Load Plotly on component mount with retry mechanism
let plotlyLoaded = false;
let retryCount = 0;
const maxRetries = 3;

const loadPlotlyWithRetry = async () => {
  const success = await loadPlotly();
  if (!success && retryCount < maxRetries) {
    retryCount++;
    console.log(`🔄 Retrying Plotly load (attempt ${retryCount}/${maxRetries})...`);
    setTimeout(loadPlotlyWithRetry, 1000 * retryCount); // Exponential backoff
  }
  plotlyLoaded = success;
  // Update global status for components to check
  window.plotlyStatus = success ? 'loaded' : 'failed';
};

loadPlotlyWithRetry();

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const DashboardContainer = styled(Box)(({ isCompact }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(20px)',
  borderRadius: isCompact ? 16 : 20,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  overflow: 'hidden',
  height: isCompact ? 'calc(100vh - 140px)' : '100%',
  width: isCompact ? '600px' : '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const DashboardHeader = styled(Box)(({ isCompact }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: isCompact ? '16px' : '20px',
  textAlign: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  }
}));

const StatsCard = styled(Card)(({ theme, isCompact }) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  height: isCompact ? '100px' : '120px',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const VisualizationContainer = styled(Paper)(({ theme, isCompact }) => ({
  padding: isCompact ? theme.spacing(2) : theme.spacing(3),
  margin: isCompact ? theme.spacing(1) : theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  maxWidth: isCompact ? 500 : 600,
  height: isCompact ? '400px' : '500px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const TopPlacesContainer = styled(Paper)({
  padding: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: 'rgba(78, 205, 196, 0.1)',
  color: '#4a6fa5',
  border: '1px solid rgba(78, 205, 196, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
  }
}));

const DataVisualizations = ({ cityName, countryCode, isCompact = false, onReady }) => {
  const [visualizations, setVisualizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [plotlyStatus, setPlotlyStatus] = useState('loading'); // 'loading', 'loaded', 'failed'

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Monitor Plotly loading status
  useEffect(() => {
    const checkPlotlyStatus = () => {
      if (window.plotlyStatus) {
        setPlotlyStatus(window.plotlyStatus);
      }
    };
    
    // Check immediately
    checkPlotlyStatus();
    
    // Set up interval to check
    const interval = setInterval(checkPlotlyStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!cityName || !countryCode) return;

    const generateVisualizations = async () => {
      setLoading(true);
      setError(null);
      setVisualizations(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('/api/visualizations', {
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
      <DashboardContainer isCompact={isCompact}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flex={1}>
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
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer isCompact={isCompact}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flex={1}>
        <Typography variant={isCompact ? "body1" : "h6"} sx={{ color: '#e74c3c', textAlign: 'center', mb: 2 }}>
          Error: {error}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(74, 111, 165, 0.7)', textAlign: 'center' }}>
          Please try searching for a different city or check your connection.
        </Typography>
      </Box>
      </DashboardContainer>
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
    height: isCompact ? 200 : 300,
    width: isCompact ? 300 : 500,
  });

  const renderCard = (header, subtitle, chartData, hideLegend = false) => {
    if (!chartData) return null;
    try {
      const plotData = JSON.parse(chartData);
      return (
        <VisualizationContainer isCompact={isCompact}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#26324B', fontWeight: 600, fontSize: isCompact ? '0.9rem' : '1.1rem' }}>
              {header}
            </Typography>
            <Tooltip title={subtitle}>
              <IconButton size="small">
                <InfoIcon fontSize="small" sx={{ color: '#4a6fa5' }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="caption" sx={{ color: '#7f8c8d', mb: 2, display: 'block' }}>
            {subtitle}
          </Typography>
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

  const topRatedPlaces = visualizations.top_rated_places ? JSON.parse(visualizations.top_rated_places) : [];

  // Calculate summary statistics
  const totalPlaces = topRatedPlaces.length;
  const avgRating = totalPlaces > 0 ? (topRatedPlaces.reduce((sum, place) => sum + place.rating, 0) / totalPlaces).toFixed(1) : 0;
  const topRating = totalPlaces > 0 ? Math.max(...topRatedPlaces.map(p => p.rating)).toFixed(1) : 0;
  const categories = [...new Set(topRatedPlaces.map(p => p.category))].length;

  const getCategoryIcon = (category) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('restaurant') || lowerCategory.includes('food')) return <RestaurantIcon />;
    if (lowerCategory.includes('hotel') || lowerCategory.includes('accommodation')) return <HotelIcon />;
    if (lowerCategory.includes('shop') || lowerCategory.includes('retail')) return <ShoppingCartIcon />;
    if (lowerCategory.includes('attraction') || lowerCategory.includes('museum')) return <AttractionsIcon />;
    return <BusinessIcon />;
  };

  return (
    <DashboardContainer isCompact={isCompact}>
      <DashboardHeader isCompact={isCompact}>
        <Typography variant={isCompact ? "h5" : "h4"} sx={{ fontWeight: 700, mb: 1, position: 'relative', zIndex: 1 }}>
          {isCompact ? 'Business Dashboard' : `Business Dashboard - ${cityName}`}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
          {isCompact ? 'Comprehensive business insights' : `Comprehensive business insights for ${cityName}, ${countryCode}`}
        </Typography>
      </DashboardHeader>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              color: '#4a6fa5',
              '&.Mui-selected': {
                color: '#667eea',
              }
            }
          }}
        >
          <Tab label="Business Environment" />
          <Tab label="Category Analysis" />
          <Tab label="Local Taste" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'rgba(248, 250, 252, 0.8)' }}>
      <TabPanel value={tabValue} index={0}>
          {/* Business Environment Overview */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: '#26324B', mb: 3, textAlign: 'center' }}>
                Business Environment Overview
              </Typography>
            </Grid>
            
            {/* Main Business Category Analysis */}
            <Grid item xs={12}>
              {renderCard('Business Category Analysis', 'Types of businesses and their distribution', visualizations.place_categories)}
            </Grid>
            
            {/* Environment Charts */}
            <Grid item xs={12} md={6}>
              {renderCard('Business Activity Patterns', 'When businesses are most active throughout the day', visualizations.business_hours, true)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCard('Seasonal Business Analysis', 'Business activity patterns across seasons', visualizations.seasonal_analysis, true)}
            </Grid>

            {/* Geographic and Quality Overview */}
            <Grid item xs={12} md={6}>
              {renderCard('Geographic Distribution', 'Spatial distribution of businesses by category', visualizations.geographic_distribution, true)}
          </Grid>
            <Grid item xs={12} md={6}>
              {renderCard('Quality Assessment', 'Distribution of business ratings and quality', visualizations.place_ratings, true)}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
          {/* Business Category Analysis */}
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: '#26324B', mb: 3, textAlign: 'center' }}>
                Business Category Analysis
              </Typography>
            </Grid>
            
            {/* Category Deep Dive */}
            <Grid item xs={12} md={6}>
              {renderCard('Business Quality vs. Categories', 'How business diversity relates to ratings', visualizations.business_density, true)}
          </Grid>
            <Grid item xs={12} md={6}>
              {renderCard('Price Range Distribution', 'Affordability spectrum of local businesses', visualizations.price_range)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCard('Category Performance Metrics', 'Detailed analysis of category performance', visualizations.place_ratings, true)}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
          {/* Local People Taste */}
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ color: '#26324B', mb: 3, textAlign: 'center' }}>
                Local People Taste & Preferences
              </Typography>
            </Grid>
            
            {/* Brand Preferences */}
            <Grid item xs={12} md={6}>
              {renderCard('Brand Popularity Ranking', 'Most popular brands in this city', visualizations.brand_popularity, true)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCard('Brand Category Distribution', 'Distribution of brand types and industries', visualizations.brand_categories)}
            </Grid>
            
            {/* Trend Analysis */}
            <Grid item xs={12} md={6}>
              {renderCard('Brand Trend Analysis', 'Popularity trends across brand categories', visualizations.brand_trend_analysis, true)}
          </Grid>
            <Grid item xs={12} md={6}>
              {renderCard('Local Keywords & Interests', 'Most common business keywords and tags', visualizations.keyword_word_cloud, true)}
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
    </DashboardContainer>
  );
};

export default DataVisualizations; 