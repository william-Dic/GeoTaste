import React, { useEffect, useRef, useState } from 'react';
import Map from './components/Map.jsx';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ203MTciLCJhIjoiY21kY3k1amNtMDJkdjJqc2M4cTdkZnJ3ZyJ9.aOfW29U47FH0vS9X8lfxLQ';

function MapView({ location, onFinish }) {
  const mapRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError(null);
    setCoords(null);
    // Geocode the location string to coordinates
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_TOKEN}`
    )
      .then(res => res.json())
      .then(data => {
        if (
          data.features &&
          data.features.length > 0 &&
          data.features[0].center
        ) {
          setCoords(data.features[0].center);
        } else {
          setError('Could not find location.');
        }
      })
      .catch(() => setError('Failed to geocode location.'))
      .finally(() => setLoading(false));
  }, [location]);

  // When the map is ready, if coords are available, fly to city immediately
  const handleMapReady = () => {
    setMapReady(true);
    if (coords && mapRef.current && mapRef.current.flyToCity) {
      mapRef.current.flyToCity(coords, 12);
    }
  };

  // When coords become available after map is ready, fly to city
  useEffect(() => {
    if (coords && mapReady && mapRef.current && mapRef.current.flyToCity) {
      mapRef.current.flyToCity(coords, 12);
    }
  }, [coords, mapReady]);

  // Zoom out and call onFinish after 5 seconds
  useEffect(() => {
    if (!mapReady || !coords || !onFinish) return;
    const timer = setTimeout(() => {
      if (mapRef.current && mapRef.current.zoomOut) {
        // Get current center and zoom before zooming out
        let center = undefined;
        let zoom = undefined;
        if (mapRef.current.getCenter && mapRef.current.getZoom) {
          center = mapRef.current.getCenter();
          zoom = mapRef.current.getZoom();
        }
        mapRef.current.zoomOut(() => {
          setTimeout(() => onFinish(center, zoom), 200); // pass center/zoom to onFinish
        });
      } else {
        onFinish();
      }
    }, 10000); // 3 seconds
    return () => clearTimeout(timer);
  }, [mapReady, coords, onFinish]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.85)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#e11d48',
        }}>
          {error}
        </div>
      )}
      <Map
        ref={mapRef}
        setMap={handleMapReady}
        style={{ width: '100vw', height: '100vh' }}
        initialCenter={coords || [-20, 40]}
        initialZoom={coords ? 12 : 1}
        markerCoords={coords}
      />
    </div>
  );
}

export default MapView;
