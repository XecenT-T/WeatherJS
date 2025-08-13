require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Get API key from environment
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', apiKey: !!API_KEY });
});

// Weather endpoint
app.get('/api/weather', (req, res) => {
  const { city, lat, lon } = req.query;
  
  if (!city && (!lat || !lon)) {
    return res.status(400).json({ error: 'City name or coordinates required' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  let url;
  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  }
  
  const https = require('https');
  https.get(url, (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });
    
    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        if (response.statusCode === 200) {
          res.json(jsonData);
        } else {
          res.status(response.statusCode).json(jsonData);
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse response' });
      }
    });
  }).on('error', (error) => {
    res.status(500).json({ error: 'Request failed' });
  });
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
}).on('error', (error) => {
  console.error('Server error:', error);
});