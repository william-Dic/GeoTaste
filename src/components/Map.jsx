import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import avatarImg from '../avatar.png';
import { createPortal } from 'react-dom';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ203MTciLCJhIjoiY21kY3k1amNtMDJkdjJqc2M4cTdkZnJ3ZyJ9.aOfW29U47FH0vS9X8lfxLQ';

const Map = forwardRef(({ setMap, style, initialCenter, initialZoom, markerCoords, dashboardMode }, ref) => {
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(initialCenter ? initialCenter[0] : -20);
  const [lat, setLat] = useState(initialCenter ? initialCenter[1] : 40);
  const [zoom, setZoom] = useState(initialZoom !== undefined ? initialZoom : 1);
  const [mapInstance, setMapInstance] = useState(null);
  const [analysisAnimation, setAnalysisAnimation] = useState(null);
  const [showGridCard, setShowGridCard] = useState(false);

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
    },
    zoomOut: (cb) => {
      if (mapInstance) {
        mapInstance.flyTo({
          center: [-20, 40],
          zoom: 1,
          duration: 1200,
          essential: true,
        });
        setTimeout(() => { if (cb) cb(); }, 1200);
      } else if (cb) {
        cb();
      }
    },
    getCenter: () => {
      if (mapInstance) {
        const c = mapInstance.getCenter();
        return [c.lng, c.lat];
      }
      return undefined;
    },
    getZoom: () => {
      if (mapInstance) {
        return mapInstance.getZoom();
      }
      return undefined;
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
        duration: 2000,
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
    const interval = setInterval(animate, 3000); // Move every 3 seconds
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
      attributionControl: false, // Hide attribution
      logoPosition: 'top-right', // Move logo out of the way (will hide with CSS)
    });

    let avatarMarker = null;
    let pinMarker = null;
    let moveInterval = null;
    let animationFrame = null;

    // Show grid card after 4 seconds if map is fully zoomed out
    let gridTimeout = null;
    function handleZoom() {
      if (map.getZoom() <= 1) {
        if (!gridTimeout) {
          gridTimeout = setTimeout(() => {
            setShowGridCard(true);
          }, 4000);
        }
      } else {
        setShowGridCard(false);
        if (gridTimeout) {
          clearTimeout(gridTimeout);
          gridTimeout = null;
        }
      }
    }
    map.on('zoom', handleZoom);
    // Initial check
    map.on('load', () => {
      handleZoom();
      map.setFog({
        color: 'rgba(180, 210, 245, 0.8)',
        'high-color': 'rgba(180, 210, 245, 0.8)',
        'horizon-blend': 0.1,
        'space-color': '#4a6fa5',
        'star-intensity': 0.3,
      });
      setMapInstance(map);
      setTimeout(() => setMap(map), 0); // Ensure setMap is called after setMapInstance

      if (markerCoords && Array.isArray(markerCoords) && markerCoords.length === 2) {
        // Create avatar marker
        const avatar = document.createElement('div');
        avatar.style.width = '38px';
        avatar.style.height = '38px';
        avatar.style.borderRadius = '50%';
        avatar.style.background = 'white';
        avatar.style.display = 'flex';
        avatar.style.alignItems = 'center';
        avatar.style.justifyContent = 'center';
        avatar.style.boxShadow = '0 2px 12px #e11d4822, 0 1.5px 8px #0008';
        avatar.style.overflow = 'hidden';
        avatar.style.border = '2.5px solid #e11d48';
        const img = document.createElement('img');
        img.src = avatarImg;
        img.alt = 'Geo Avatar';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        avatar.appendChild(img);
        avatarMarker = new mapboxgl.Marker({ element: avatar, anchor: 'bottom' })
          .setLngLat(markerCoords)
          .setOffset([0, -38])
          .addTo(map);

        // Create pin marker
        const pin = document.createElement('div');
        pin.style.width = '24px';
        pin.style.height = '24px';
        pin.style.background = 'none';
        pin.style.display = 'flex';
        pin.style.alignItems = 'center';
        pin.style.justifyContent = 'center';
        pin.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.03 2 3 6.03 3 11C3 16.25 10.13 21.54 11.13 22.29C11.37 22.47 11.68 22.56 12 22.56C12.32 22.56 12.63 22.47 12.87 22.29C13.87 21.54 21 16.25 21 11C21 6.03 16.97 2 12 2ZM12 13.5C10.07 13.5 8.5 11.93 8.5 10C8.5 8.07 10.07 6.5 12 6.5C13.93 6.5 15.5 8.07 15.5 10C15.5 11.93 13.93 13.5 12 13.5Z" fill="#e11d48"/></svg>`;
        pinMarker = new mapboxgl.Marker({ element: pin, anchor: 'bottom' })
          .setLngLat(markerCoords)
          .addTo(map);

        if (!dashboardMode) {
          // Smooth movement variables
          let currentPos = markerCoords.slice();
          let targetPos = markerCoords.slice();
          let animating = false;

          function lerp(a, b, t) {
            return a + (b - a) * t;
          }

          // Helper to get a random point within 5km radius of markerCoords
          function randomPointWithinRadius(center, radiusKm) {
            const R = 6371; // Earth radius in km
            const [lng, lat] = center;
            const bearing = Math.random() * 2 * Math.PI;
            const distance = Math.random() * radiusKm;
            // Offset in radians
            const lat1 = lat * Math.PI / 180;
            const lng1 = lng * Math.PI / 180;
            const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) + Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));
            const lng2 = lng1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1), Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2));
            return [lng2 * 180 / Math.PI, lat2 * 180 / Math.PI];
          }

          function animateMarker() {
            if (!animating) return;
            currentPos[0] = lerp(currentPos[0], targetPos[0], 0.08);
            currentPos[1] = lerp(currentPos[1], targetPos[1], 0.08);
            avatarMarker.setLngLat(currentPos);
            pinMarker.setLngLat(currentPos);
            const dist = Math.sqrt(
              Math.pow(currentPos[0] - targetPos[0], 2) +
              Math.pow(currentPos[1] - targetPos[1], 2)
            );
            if (dist < 0.0005) {
              currentPos = targetPos.slice();
              avatarMarker.setLngLat(currentPos);
              pinMarker.setLngLat(currentPos);
              animating = false;
              return;
            }
            animationFrame = requestAnimationFrame(animateMarker);
          }

          moveInterval = setInterval(() => {
            targetPos = randomPointWithinRadius(markerCoords, 8); // 8km radius
            if (!animating) {
              animating = true;
              animationFrame = requestAnimationFrame(animateMarker);
            }
          }, 3000);
        }
      }
    });

    return () => {
      if (analysisAnimation) {
        clearInterval(analysisAnimation);
      }
      if (moveInterval) {
        clearInterval(moveInterval);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (gridTimeout) clearTimeout(gridTimeout);
      map.off('zoom', handleZoom);
      map.remove();
    };
  }, [setMap, markerCoords, dashboardMode]);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', ...style }}>
      <style>{`
        .mapboxgl-ctrl-attrib, .mapboxgl-ctrl-logo { display: none !important; }
      `}</style>
      <div
        ref={mapContainer}
        className="map-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
      />
      {/* Removed overlay grid */}
    </div>
  );
});

Map.displayName = 'Map';

export default Map; 