import React from 'react';
import Plot from 'react-plotly.js';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Grid, Box } from '@mui/material';

const VisualizationContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  height: '500px',
  width: '100%',
  marginBottom: theme.spacing(2),
}));

const DemoVisualizations = ({ cityName }) => {
  // Sample data for demonstration
  const brandPopularityData = {
    data: [{
      x: [85, 78, 72, 68, 65, 62, 58, 55, 52, 48],
      y: ['Nike', 'Apple', 'McDonald\'s', 'Starbucks', 'Coca-Cola', 'Adidas', 'Samsung', 'BMW', 'Netflix', 'Spotify'],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgba(58, 200, 225, 0.8)'
      }
    }],
    layout: {
      title: `Brand Popularity in ${cityName}`,
      xaxis: { title: 'Popularity (%)' },
      yaxis: { title: 'Brands' },
      height: 500
    }
  };

  const brandCategoriesData = {
    data: [{
      values: [25, 20, 15, 12, 10, 8, 6, 4],
      labels: ['Technology', 'Food & Beverage', 'Fashion', 'Automotive', 'Entertainment', 'Sports', 'Finance', 'Other'],
      type: 'pie',
      marker: {
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
      }
    }],
    layout: {
      title: `Brand Categories in ${cityName}`,
      height: 500
    }
  };

  const placeRatingsData = {
    data: [{
      x: [3.5, 4.0, 4.5, 5.0],
      type: 'histogram',
      nbinsx: 8,
      marker: {
        color: '#4ECDC4'
      }
    }],
    layout: {
      title: `Place Ratings Distribution in ${cityName}`,
      xaxis: { title: 'Rating' },
      yaxis: { title: 'Number of Places' },
      height: 500
    }
  };

  const placeCategoriesData = {
    data: [{
      x: [15, 12, 10, 8, 6, 5, 4, 3],
      y: ['Restaurants', 'Hotels', 'Museums', 'Parks', 'Shopping', 'Theaters', 'Cafes', 'Landmarks'],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgba(255, 107, 107, 0.8)'
      }
    }],
    layout: {
      title: `Place Categories in ${cityName}`,
      xaxis: { title: 'Number of Places' },
      yaxis: { title: 'Categories' },
      height: 500
    }
  };

  const renderChart = (chartData, title) => {
    return (
      <VisualizationContainer>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <ChartContainer>
          <Plot
            data={chartData.data}
            layout={{
              ...chartData.layout,
              autosize: true,
              margin: { l: 50, r: 50, t: 50, b: 50 },
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
          />
        </ChartContainer>
      </VisualizationContainer>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
        Business Insights for {cityName}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {renderChart(brandPopularityData, 'Brand Popularity')}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {renderChart(brandCategoriesData, 'Brand Categories')}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {renderChart(placeRatingsData, 'Place Ratings Distribution')}
        </Grid>
        
        <Grid item xs={12} md={6}>
          {renderChart(placeCategoriesData, 'Place Categories')}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemoVisualizations; 