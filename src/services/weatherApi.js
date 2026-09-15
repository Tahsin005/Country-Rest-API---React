const weatherCache = new Map();

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: 'sun' },
  1: { label: 'Mainly Clear', icon: 'sun-cloud' },
  2: { label: 'Partly Cloudy', icon: 'cloud' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Foggy', icon: 'cloud-fog' },
  48: { label: 'Depositing Rime Fog', icon: 'cloud-fog' },
  51: { label: 'Light Drizzle', icon: 'cloud-drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'cloud-drizzle' },
  55: { label: 'Dense Drizzle', icon: 'cloud-drizzle' },
  61: { label: 'Slight Rain', icon: 'cloud-rain' },
  63: { label: 'Moderate Rain', icon: 'cloud-rain' },
  65: { label: 'Heavy Rain', icon: 'cloud-rain' },
  71: { label: 'Slight Snow', icon: 'cloud-snow' },
  73: { label: 'Moderate Snow', icon: 'cloud-snow' },
  75: { label: 'Heavy Snow', icon: 'cloud-snow' },
  80: { label: 'Slight Rain Showers', icon: 'cloud-rain' },
  81: { label: 'Moderate Showers', icon: 'cloud-rain' },
  82: { label: 'Violent Showers', icon: 'cloud-lightning' },
  85: { label: 'Snow Showers', icon: 'cloud-snow' },
  86: { label: 'Heavy Snow Showers', icon: 'cloud-snow' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { label: 'Thunderstorm with Hail', icon: 'cloud-lightning' },
  99: { label: 'Severe Thunderstorm', icon: 'cloud-lightning' },
};

export const getWeatherDescription = (code) => {
  return WMO_CODES[code] || { label: 'Clear', icon: 'sun' };
};

export const weatherApi = {
  getForecast: async (lat, lng) => {
    if (lat === undefined || lng === undefined || lat === null || lng === null) return null;

    const roundedLat = Number(lat).toFixed(2);
    const roundedLng = Number(lng).toFixed(2);
    const cacheKey = `${roundedLat},${roundedLng}`;

    if (weatherCache.has(cacheKey)) {
      return weatherCache.get(cacheKey);
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) return null;

      const data = await response.json();
      const current = data.current;
      const daily = data.daily;

      const currentWeather = {
        temperature: Math.round(current?.temperature_2m ?? 0),
        feelsLike: Math.round(current?.apparent_temperature ?? 0),
        humidity: current?.relative_humidity_2m ?? 0,
        windSpeed: Math.round(current?.wind_speed_10m ?? 0),
        isDay: Boolean(current?.is_day),
        condition: getWeatherDescription(current?.weather_code),
        weatherCode: current?.weather_code,
      };

      const forecastDays = (daily?.time || []).slice(1, 4).map((timeStr, idx) => {
        const dateObj = new Date(timeStr);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(daily.temperature_2m_max[idx + 1] ?? 0);
        const minTemp = Math.round(daily.temperature_2m_min[idx + 1] ?? 0);
        const code = daily.weather_code[idx + 1];

        return {
          day: dayName,
          date: timeStr,
          maxTemp,
          minTemp,
          condition: getWeatherDescription(code),
        };
      });

      const result = {
        current: currentWeather,
        forecast: forecastDays,
        timezone: data.timezone,
      };

      weatherCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('Weather fetch failed:', err);
      return null;
    }
  },
};
