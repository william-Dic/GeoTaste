import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ203MTciLCJhIjoiY21kY3k1amNtMDJkdjJqc2M4cTdkZnJ3ZyJ9.aOfW29U47FH0vS9X8lfxLQ';

const Map = forwardRef(({ setMap }, ref) => {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(-20);
  const [lat, setLat] = useState(40);
  const [zoom, setZoom] = useState(1);
  const [mapInstance, setMapInstance] = useState(null);
  const [analysisAnimation, setAnalysisAnimation] = useState(null);

  useImperativeHandle(ref, () => ({
    startAnalysisAnimation: (cityCenter, cityName) => {
      if (mapInstance) {
        startAgentAnalysis(mapInstance, cityCenter, cityName);
      }
    },
    stopAnalysisAnimation: () => {
      if (analysisAnimation) {
        clearInterval(analysisAnimation);
        setAnalysisAnimation(null);
      }
    },
    flyToCity: (center, zoomLevel = 12) => {
      if (mapInstance) {
        mapInstance.flyTo({
          center: center,
          zoom: zoomLevel,
          essential: true,
        });
      }
    }
  }));

  const startAgentAnalysis = (map, cityCenter, cityName) => {
    // Stop any existing animation
    if (analysisAnimation) {
      clearInterval(analysisAnimation);
    }

    // Create analysis points around the city center
    const analysisPoints = generateAnalysisPoints(cityCenter, 8);
    let currentPointIndex = 0;

    // Add a marker for the GeoTaste Agent
    const agentMarker = new mapboxgl.Marker({
      color: '#4ECDC4',
      scale: 0.8
    })
    .setLngLat(cityCenter)
    .addTo(map);

    // Add analysis status popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'agent-popup'
    });

    const analysisMessages = [
      `🔍 GeoTaste Agent analyzing business environment in ${cityName}...`,
      `📊 Calling Qloo API for brand insights...`,
      `🏢 Gathering local business data...`,
      `📈 Processing market analytics...`,
      `🎯 Identifying top brands and categories...`,
      `📋 Compiling business intelligence...`,
      `✨ Generating visualizations...`,
      `🚀 Almost ready with insights!`
    ];

    let messageIndex = 0;

    const animate = () => {
      if (currentPointIndex >= analysisPoints.length) {
        currentPointIndex = 0;
      }

      const targetPoint = analysisPoints[currentPointIndex];
      
      // Smoothly move to the analysis point
      map.flyTo({
        center: targetPoint,
        zoom: 13 + Math.random() * 2, // Random zoom between 13-15
        duration: 1200, // Faster movement
        essential: true,
      });

      // Update agent marker position
      agentMarker.setLngLat(targetPoint);

      // Update popup message
      const message = analysisMessages[messageIndex % analysisMessages.length];
      popup.setLngLat(targetPoint)
        .setHTML(`
          <div style="padding: 8px; text-align: center; font-family: 'Inter', sans-serif;">
            <div style="font-weight: 600; color: #4a6fa5; margin-bottom: 4px;">🤖 GeoTaste Agent</div>
            <div style="font-size: 12px; color: #666; max-width: 200px;">${message}</div>
          </div>
        `)
        .addTo(map);

      currentPointIndex++;
      messageIndex++;
    };

    // Start the animation
    animate();
    const interval = setInterval(animate, 1800); // Move every 1.8 seconds - more frequent
    setAnalysisAnimation(interval);

    // Return cleanup function
    return () => {
      clearInterval(interval);
      agentMarker.remove();
      popup.remove();
    };
  };

  const generateAnalysisPoints = (center, count) => {
    const points = [];
    const radius = 0.02; // Approximate radius in degrees
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const distance = radius * (0.5 + Math.random() * 0.5); // Random distance within radius
      
      const lat = center[1] + distance * Math.cos(angle);
      const lng = center[0] + distance * Math.sin(angle);
      
      points.push([lng, lat]);
    }
    
    return points;
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
      projection: 'globe',
    });

    map.on('load', () => {
      map.setFog({
        color: 'rgba(180, 210, 245, 0.8)',
        'high-color': 'rgba(180, 210, 245, 0.8)',
        'horizon-blend': 0.1,
        'space-color': '#4a6fa5',
        'star-intensity': 0.3,
      });
      setMapInstance(map);
      setMap(map);
    });

    return () => {
      if (analysisAnimation) {
        clearInterval(analysisAnimation);
      }
      map.remove();
    };
  }, [setMap]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" style={{ height: '100vh', width: '100vw' }} />
    </div>
  );
});

Map.displayName = 'Map';

export default Map; 