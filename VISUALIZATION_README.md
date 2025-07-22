# GeoTaste Visualization System

## Overview
This project includes a comprehensive visualization system for analyzing business data from the Qloo API. The system provides interactive charts and graphs to help users understand brand popularity, place categories, and business insights for different cities.

## Features

### 1. Brand Analysis Visualizations
- **Brand Popularity Chart**: Horizontal bar chart showing the popularity percentage of different brands in a city
- **Brand Categories Pie Chart**: Pie chart displaying the distribution of brand categories (Technology, Food & Beverage, Fashion, etc.)

### 2. Place Analysis Visualizations
- **Place Ratings Distribution**: Histogram showing the distribution of business ratings in a city
- **Place Categories Chart**: Horizontal bar chart displaying the most common place categories (Restaurants, Hotels, Museums, etc.)

### 3. Interactive Features
- Search for any city and get instant visualizations
- Responsive design that works on different screen sizes
- Smooth animations and transitions
- Close button to return to the map view

## Technical Architecture

### Backend (Python)
- **`qloo_analysis.py`**: Core API integration with Qloo
- **`visualizations.py`**: Visualization generation using Plotly and Pandas
- **`app.py`**: Flask API server for serving visualization data

### Frontend (React)
- **`DemoVisualizations.jsx`**: Demo component with sample data
- **`DataVisualizations.jsx`**: Full component for real API data
- **`App.jsx`**: Main application with map and visualization overlay

## Installation & Setup

### Backend Dependencies
```bash
pip install matplotlib seaborn plotly pandas numpy flask flask-cors
```

### Frontend Dependencies
```bash
npm install react-plotly.js plotly.js
```

## Usage

### 1. Start the Backend Server
```bash
cd Backend
python app.py
```

### 2. Start the Frontend Development Server
```bash
npm run dev
```

### 3. Using the Application
1. Open the application in your browser
2. Search for a city using the search bar
3. The map will zoom to the city
4. Business insights visualizations will appear as an overlay
5. Click the × button to close the visualizations and return to the map

## API Endpoints

### POST /api/visualizations
Generates visualizations for a specific city.

**Request Body:**
```json
{
  "city": "London",
  "country": "GB",
  "limit": 20
}
```

**Response:**
```json
{
  "brand_popularity": "...",
  "brand_categories": "...",
  "place_ratings": "...",
  "place_categories": "..."
}
```

## Visualization Types

### 1. Brand Popularity Chart
- **Type**: Horizontal Bar Chart
- **Data**: Brand names vs. popularity percentages
- **Colors**: Viridis color scale
- **Use Case**: Compare brand popularity across cities

### 2. Brand Categories Pie Chart
- **Type**: Pie Chart
- **Data**: Brand category distribution
- **Colors**: Custom color palette
- **Use Case**: Understand brand category diversity

### 3. Place Ratings Distribution
- **Type**: Histogram
- **Data**: Distribution of business ratings
- **Colors**: Teal color scheme
- **Use Case**: Assess overall business quality

### 4. Place Categories Chart
- **Type**: Horizontal Bar Chart
- **Data**: Place categories vs. count
- **Colors**: Plasma color scale
- **Use Case**: Identify most common business types

## Customization

### Adding New Visualizations
1. Add a new method to the `QlooVisualizer` class in `visualizations.py`
2. Update the `generate_all_visualizations` method
3. Add the new chart to the React component
4. Update the API endpoint if needed

### Styling
- Charts use Plotly's built-in styling
- Custom colors can be modified in the `QlooVisualizer` class
- React components use Material-UI styling system

## Future Enhancements

1. **Real-time Data**: Connect to live Qloo API data
2. **Comparison Mode**: Compare multiple cities side-by-side
3. **Export Features**: Download charts as PNG/PDF
4. **Advanced Filters**: Filter by date, category, or rating
5. **Interactive Maps**: Click on map points to see local insights

## Troubleshooting

### Common Issues
1. **API Key Issues**: Ensure your Qloo API key is properly set
2. **CORS Errors**: Make sure the Flask server is running with CORS enabled
3. **Chart Not Loading**: Check browser console for JavaScript errors
4. **Data Not Loading**: Verify the backend server is running on port 5000

### Debug Mode
- Backend: Set `debug=True` in Flask app
- Frontend: Check browser developer tools
- API: Use `/api/health` endpoint to test connectivity

## Contributing
1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License. 