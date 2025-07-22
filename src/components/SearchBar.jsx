import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import mapboxgl from 'mapbox-gl';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mbxGeocoding({ accessToken: mapboxgl.accessToken });

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

  const handleSearch = () => {
    if (!map || !query) return;

    // Notify parent that search is starting
    if (onSearchStart) {
      onSearchStart();
    }

    geocodingClient
      .forwardGeocode({
        query: query,
        limit: 1,
      })
      .send()
      .then((response) => {
        const match = response.body;
        if (match && match.features && match.features.length) {
          const { center, place_name, text } = match.features[0];
          
          // Extract city and country code robustly
          let cityName = text;
          let countryCode = 'US';
          if (match.features[0].context) {
            for (const ctx of match.features[0].context) {
              if (ctx.id.startsWith('place')) cityName = ctx.text;
              if (ctx.id.startsWith('country')) countryCode = ctx.short_code?.toUpperCase() || countryCode;
            }
          }
          // Fallback to feature text if no context
          if (!cityName) cityName = text;
          
          // Debug log
          console.log('[SearchBar] Sending to backend:', cityName, countryCode);
          
          // Call the onCitySearch callback with the city name and country code
          if (onCitySearch) {
            onCitySearch(cityName, countryCode, center);
          }
        }
      });
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