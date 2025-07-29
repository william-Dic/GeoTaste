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
    const analysisPoints = generateAnalysisPoints(cityCenter, 10);
    let currentPointIndex = 0;

    // Add a marker for the GeoTaste Agent
    const agentMarker = new mapboxgl.Marker({
      color: '#4ECDC4',
      scale: 0.9
    })
    .setLngLat(cityCenter)
    .addTo(map);

    // Enhanced analysis messages with more Qloo mentions
    const analysisMessages = [
      {
        title: "🔍 Initializing Analysis",
        message: `GeoTaste Agent starting business environment scan for ${cityName}`,
        detail: "Connecting to Qloo API for location intelligence..."
      },
      {
        title: "📊 Qloo Brand Intelligence",
        message: "Fetching brand popularity and consumer preference data",
        detail: "Analyzing top brands and market leaders via Qloo API"
      },
      {
        title: "🏢 Qloo Business Data",
        message: "Gathering local business and place information",
        detail: "Retrieving business ratings, categories, and market insights"
      },
      {
        title: "📈 Market Analytics",
        message: "Processing Qloo location intelligence data",
        detail: "Calculating business density and market opportunities"
      },
      {
        title: "🎯 Brand & Category Analysis",
        message: "Identifying top-performing brands and business categories",
        detail: "Qloo data revealing consumer preferences and market trends"
      },
      {
        title: "📋 Business Intelligence",
        message: "Compiling comprehensive market analysis report",
        detail: "Synthesizing Qloo insights with AI-powered analysis"
      },
      {
        title: "✨ Data Visualization",
        message: "Generating interactive charts and business insights",
        detail: "Creating visual reports from Qloo location data"
      },
      {
        title: "🚀 Analysis Complete",
        message: "Business environment analysis ready for review",
        detail: "Qloo-powered insights available in analysis panels"
      },
      {
        title: "💡 Market Opportunities",
        message: "Identifying business opportunities and market gaps",
        detail: "Qloo data highlighting untapped market potential"
      },
      {
        title: "📊 Final Insights",
        message: "Preparing executive summary and key findings",
        detail: "Qloo location intelligence + AI analysis complete"
      }
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
        duration: 1200, // Slightly slower for better readability
        essential: true,
      });

      // Update agent marker position
      agentMarker.setLngLat(targetPoint);

      // Update popup message with enhanced styling
      const currentMessage = analysisMessages[messageIndex % analysisMessages.length];
      popup.setLngLat(targetPoint)
        .setHTML(`
          <div style="
            padding: 16px; 
            text-align: left; 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-width: 280px;
            max-width: 320px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(78, 205, 196, 0.3);
          ">
            <div style="
              display: flex; 
              align-items: center; 
              gap: 8px; 
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid rgba(78, 205, 196, 0.2);
            ">
              <div style="
                width: 8px; 
                height: 8px; 
                background: #4ECDC4; 
                border-radius: 50%; 
                animation: pulse 2s infinite;
              "></div>
              <div style="
                font-weight: 700; 
                color: #4a6fa5; 
                font-size: 14px;
              ">🤖 GeoTaste Agent</div>
              <div style="
                font-size: 10px; 
                color: #4ECDC4; 
                background: rgba(78, 205, 196, 0.1); 
                padding: 2px 6px; 
                border-radius: 10px;
                font-weight: 600;
              ">QLOO</div>
            </div>
            
            <div style="
              font-weight: 600; 
              color: #26324B; 
              font-size: 13px; 
              margin-bottom: 6px;
              line-height: 1.3;
            ">${currentMessage.title}</div>
            
            <div style="
              font-size: 12px; 
              color: #374151; 
              margin-bottom: 4px;
              line-height: 1.4;
            ">${currentMessage.message}</div>
            
            <div style="
              font-size: 11px; 
              color: #6B7280; 
              font-style: italic;
              line-height: 1.3;
              padding-top: 4px;
              border-top: 1px solid rgba(0, 0, 0, 0.05);
            ">${currentMessage.detail}</div>
            
            <style>
              @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
              }
            </style>
          </div>
        `)
        .addTo(map);

      currentPointIndex++;
      messageIndex++;
    };

    // Add analysis status popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'agent-popup',
      maxWidth: 'none'
    });

    // Start the animation
    animate();
    const interval = setInterval(animate, 1200); // Move every 1.8 seconds
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
    const radius = 0.025; // Slightly larger radius for better coverage
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const distance = radius * (0.4 + Math.random() * 0.6); // More varied distance
      
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
