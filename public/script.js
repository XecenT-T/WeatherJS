class WeatherApp {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/weather'; // Back to port 3000
        this.init();
        this.testAPI(); // Test API connection
    }

    init() {
        this.bindEvents();
        this.setCurrentDate();
    }

    async testAPI() {
        // Test the API with a simple city to verify it's working
        try {
            const testUrl = 'http://localhost:3000/api/test';
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

        searchBtn.addEventListener('click', () => this.searchWeather());
        locationBtn.addEventListener('click', () => this.getLocationWeather());
        
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        // Add event listeners for suggestion buttons
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
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const weatherData = await this.fetchWeatherDataByCoords(latitude, longitude);
                    this.displayWeather(weatherData);
                } catch (error) {
                    console.error('Location weather error:', error);
                    this.showError('Failed to get weather for your location. Please try searching for a city instead.');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.showError('Unable to get your location. Please enable location access or search for a city manually.');
            }
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
        
        // Update city name and date
        document.getElementById('cityName').textContent = data.name + ', ' + data.sys.country;
        
        // Update temperature
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        
        // Update weather description and icon
        const weatherDesc = data.weather[0].description;
        document.getElementById('weatherDesc').textContent = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
        
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById('weatherIcon').src = iconUrl;
        
        // Update weather details
        document.getElementById('feelsLike').textContent = Math.round(data.main.feels_like) + '°C';
        document.getElementById('humidity').textContent = data.main.humidity + '%';
        document.getElementById('windSpeed').textContent = data.wind.speed + ' m/s';
        document.getElementById('pressure').textContent = data.main.pressure + ' hPa';
        
        // Show weather info
        document.getElementById('weatherInfo').style.display = 'block';
        
        // Clear input
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
