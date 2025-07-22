import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #4a6fa5;
  }

  /* Custom styles for GeoTaste Agent popup */
  .agent-popup .mapboxgl-popup-content {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(78, 205, 196, 0.3);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    padding: 0;
    min-width: 220px;
  }

  .agent-popup .mapboxgl-popup-tip {
    border-top-color: rgba(255, 255, 255, 0.95);
  }

  .agent-popup .mapboxgl-popup-close-button {
    display: none;
  }

  /* Animation for the agent marker */
  .mapboxgl-marker {
    transition: all 0.3s ease;
  }

  .mapboxgl-marker:hover {
    transform: scale(1.1);
  }

  /* Prevent chart stretching and unwanted interactions */
  .js-plotly-plot {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
  }

  .plotly {
    width: 100% !important;
    height: 100% !important;
  }

  .plot-container {
    width: 100% !important;
    height: 100% !important;
  }

  /* Disable unwanted Plotly interactions */
  .plotly .modebar {
    display: none !important;
  }

  .plotly .main-svg {
    pointer-events: none;
  }

  .plotly .bglayer {
    pointer-events: none;
  }

  /* Prevent text selection on charts */
  .plotly .text {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* Ensure stable chart containers */
  [data-testid="plotly-chart"] {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
  }

  /* Prevent any unwanted resizing */
  .plotly-graph-div {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
  }
`;

export default GlobalStyle; 