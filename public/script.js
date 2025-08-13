class WeatherApp {
    constructor() {
        this.baseUrl = this.getApiUrl();
        this.init();
        this.testAPI();
    }

    getApiUrl() {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalhost) {
            return 'http://localhost:3000/api/weather';
        } else {
            return `${window.location.origin}/api/weather`;
        }
    }

    getTestUrl() {
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalhost) {
            return 'http://localhost:3000/api/test';
        } else {
            return `${window.location.origin}/api/test`;
        }
    }

    init() {
        this.bindEvents();
        this.setCurrentDate();
    }

    async testAPI() {
        try {
            const testUrl = this.getTestUrl();
            const response = await fetch(testUrl);
            if (response.ok) {
                console.log('✅ API connection successful');
            } else {
                console.error('❌ API connection failed:', response.status);
            }
        } catch (error) {
            console.error('❌ API test failed:', error);
        }
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const locationBtn = document.getElementById('locationBtn');
        const cityInput = document.getElementById('cityInput');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        const debugBtn = document.getElementById('debugBtn');

        searchBtn.addEventListener('click', () => this.searchWeather());
        locationBtn.addEventListener('click', () => this.getLocationWeather());
        debugBtn.addEventListener('click', () => this.testCoordinates());
        
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const city = btn.getAttribute('data-city');
                cityInput.value = city;
                this.searchWeather();
            });
        });
    }

    setCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    async searchWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        try {
            const weatherData = await this.fetchWeatherData(city);
            this.displayWeather(weatherData);
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError(error.message);
        }
    }

    async getLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser. Please try a different browser or search for a city manually.');
            return;
        }

        console.log('Requesting location permission...');
        this.showLoading();
        
        const geolocationOptions = {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 300000
        };
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    console.log('Location obtained:', { latitude, longitude });
                    const weatherData = await this.fetchWeatherDataByCoords(latitude, longitude);
                    this.displayWeather(weatherData);
                } catch (error) {
                    console.error('Location weather error:', error);
                    this.showError('Failed to get weather for your location. Please try searching for a city instead.');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please enable location access in your browser settings and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is currently unavailable. Please try again later or search for a city.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. This usually means:\n• Location services are disabled\n• Browser needs location permission\n• Try refreshing the page and allowing location access';
                        break;
                    default:
                        errorMessage += 'Please enable location access or search for a city manually.';
                }
                
                this.showError(errorMessage);
            },
            geolocationOptions
        );
    }

    async fetchWeatherData(city) {
        const url = `${this.baseUrl}?city=${encodeURIComponent(city)}`;
        console.log('Fetching weather for:', city);
        console.log('API URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error:', errorData);
            
            if (response.status === 400) {
                throw new Error('Please provide a valid city name.');
            } else if (response.status === 404) {
                throw new Error(`City "${city}" not found. Try a different spelling or city name.`);
            } else if (response.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error(`Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        return data;
    }

    async fetchWeatherDataByCoords(lat, lon) {
        const url = `${this.baseUrl}?lat=${lat}&lon=${lon}`;
        console.log('Fetching weather by coordinates:', lat, lon);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Coordinates API Error:', errorData);
            throw new Error(`Failed to fetch weather data: ${response.status}`);
        }
        
        return await response.json();
    }

    displayWeather(data) {
        this.hideLoading();
        this.hideError();
        
        document.getElementById('cityName').textContent = data.name + ', ' + data.sys.country;
        
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        
        const weatherDesc = data.weather[0].description;
        document.getElementById('weatherDesc').textContent = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
        
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;
        
        document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like) + '°C';
        document.getElementById('humidity').textContent = data.main.humidity + '%';
        document.getElementById('windSpeed').textContent = data.wind.speed + ' m/s';
        document.getElementById('pressure').textContent = data.main.pressure + ' hPa';
        
        document.getElementById('weatherInfo').style.display = 'block';
        
        document.getElementById('cityInput').value = '';
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherInfo').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        document.getElementById('weatherInfo').style.display = 'none';
        const errorElement = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        errorText.textContent = message;
        errorElement.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    async testCoordinates() {
        console.log('Testing coordinates functionality with Tokyo coordinates...');
        this.showLoading();
        
        try {
            const tokyoLat = 35.6895;
            const tokyoLon = 139.6917;
            console.log('Using Tokyo coordinates:', { lat: tokyoLat, lon: tokyoLon });
            
            const weatherData = await this.fetchWeatherDataByCoords(tokyoLat, tokyoLon);
            this.displayWeather(weatherData);
        } catch (error) {
            console.error('Test coordinates error:', error);
            this.showError('Failed to test coordinates. Error: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
