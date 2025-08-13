# WeatherJS 🌤️

A real-time weather application with auto-location detection and city search, built with Node.js, Express, and OpenWeatherMap API.

## ✨ Features

- 🌍 **Auto-location Detection** - Get weather for your current location
- 🔍 **City Search** - Search for weather in any city worldwide
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Beautiful gradient design with glassmorphism effects
- ⚡ **Real-time Data** - Live weather information from OpenWeatherMap
- 🚀 **Fast & Lightweight** - Built with vanilla JavaScript and Express

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: OpenWeatherMap Weather API
- **Styling**: Modern CSS with gradients and animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenWeatherMap API key

### Installation
```bash
# Clone the repository
git clone https://github.com/XecenT-T/WeatherJS.git
cd WeatherJS

# Install dependencies
npm install

# Create .env file with your API key
echo "OPENWEATHER_API_KEY=your_api_key_here" > .env

# Start the development server
npm start
```

Visit `http://localhost:3000` to see your app!

## 🌐 Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `WeatherJS` repository

4. **Configure Service**
   - **Name**: `weatherjs` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose your plan)

5. **Set Environment Variables**
   - Click "Environment" tab
   - Add: `OPENWEATHER_API_KEY` = `your_actual_api_key`
   - Add: `NODE_ENV` = `production`

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment
   - Your app will be available at `https://your-app-name.onrender.com`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | ✅ Yes |
| `NODE_ENV` | Environment (development/production) | ❌ No |
| `PORT` | Port number (Render sets this automatically) | ❌ No |

### Other Deployment Platforms

#### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set OPENWEATHER_API_KEY=your_api_key
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
railway login
railway init
railway up
```

#### DigitalOcean App Platform
- Connect your GitHub repo
- Set environment variables
- Deploy with one click

## 🔑 Getting OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Go to "My API Keys" section
4. Copy your API key
5. Add it to your environment variables

## 📁 Project Structure

```
WeatherJS/
├── public/                 # Frontend files
│   ├── Index.html         # Main HTML file
│   ├── Style.css          # CSS styles
│   └── script.js          # Frontend JavaScript
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🧪 Testing

```bash
# Test the API endpoints
curl http://localhost:3000/api/test
curl "http://localhost:3000/api/weather?city=London"
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Check if `.env` file exists
   - Verify API key is correct
   - Ensure environment variable is set in production

2. **Location Not Working**
   - Check browser permissions
   - Enable device location services
   - Try different browser

3. **Deployment Fails**
   - Check build logs in Render
   - Verify all dependencies in `package.json`
   - Ensure environment variables are set

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
- Check the troubleshooting section
- Open an issue on GitHub
- Review the console logs for errors

---

**Happy Weather Tracking! 🌤️☀️🌧️**