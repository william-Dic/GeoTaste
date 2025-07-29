import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchContainer = styled(Paper)(({ theme }) => ({
  borderRadius: 50,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  width: 600,
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontSize: '1.1rem',
  color: 'white',
}));

const SearchBar = ({ map, onCitySearch, onSearchStart }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Notify parent that search is starting
    if (onSearchStart) {
      onSearchStart();
    }

    try {
      // Use basic fetch instead of Mapbox SDK
      const accessToken = process.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const { center, place_name, text } = feature;
        
        // Extract city and country code
        let cityName = text;
        let countryCode = 'US';
        
        if (feature.context) {
          for (const ctx of feature.context) {
            if (ctx.id.startsWith('place')) cityName = ctx.text;
            if (ctx.id.startsWith('country')) countryCode = ctx.short_code?.toUpperCase() || countryCode;
          }
        }
        
        // Fallback to feature text if no context
        if (!cityName) cityName = text;
        
        console.log('[SearchBar] Found location:', cityName, countryCode);
        
        // Call the onCitySearch callback
        if (onCitySearch) {
          onCitySearch(cityName, countryCode, center);
        }
      } else {
        console.log('[SearchBar] No results found for:', query);
        alert('No results found for this search. Please try a different city name.');
      }
    } catch (error) {
      console.error('[SearchBar] Geocoding error:', error);
      alert('Search failed. Please try again.');
    }
  };

  return (
    <SearchContainer>
      <StyledInputBase
        placeholder="Search for a city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <IconButton
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
        }}
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </SearchContainer>
  );
};

export default SearchBar; 