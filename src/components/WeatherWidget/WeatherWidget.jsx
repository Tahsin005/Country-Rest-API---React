import PropTypes from 'prop-types';
import { useWeather } from '../../hooks/useQueries';
import {
  Sun, Cloud, CloudRain, CloudSnow,
  CloudLightning, CloudDrizzle, CloudFog,
  Wind, Droplets, Thermometer, Sparkles
} from 'lucide-react';

const renderWeatherIcon = (iconName, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'sun':
      return <Sun className={`${className} text-amber-400`} />;
    case 'sun-cloud':
      return <Sun className={`${className} text-amber-300`} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-sky-400`} />;
    case 'cloud-snow':
      return <CloudSnow className={`${className} text-blue-200`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-purple-400`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-cyan-300`} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-400`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
};

const WeatherWidget = ({ coordinates, locationName }) => {
  const { data: weather, isLoading } = useWeather(coordinates?.lat, coordinates?.lng);

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton w-8 h-8 rounded-full" />
        </div>
        <div className="skeleton h-12 w-24 mb-4" />
        <div className="grid grid-cols-3 gap-2">
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-16 rounded-xl" />
          <div className="skeleton h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return null;
  }

  const { current, forecast } = weather;

  return (
    <div className="glass-card glass-shimmer p-6 rounded-2xl relative overflow-hidden group">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="section-label text-[10px]">
            Live Weather · {locationName || 'Capital'}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          {renderWeatherIcon(current.condition.icon, 'w-6 h-6')}
        </div>
      </div>


      <div className="flex items-baseline justify-between mb-6">
        <div>
          <div className="flex items-start">
            <span className="font-display text-5xl font-bold tracking-tight text-foreground">
              {current.temperature}
            </span>
            <span className="font-display text-2xl font-light text-muted-foreground ml-1">°C</span>
          </div>
          <span className="text-sm font-display font-medium text-foreground/80 mt-1 block">
            {current.condition.label}
          </span>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground font-display">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-primary" />
            <span>Feels {current.feelsLike}°C</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>{current.humidity}% Humidity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>{current.windSpeed} km/h</span>
          </div>
        </div>
      </div>


      {forecast && forecast.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <span className="text-[10px] uppercase tracking-wider font-display font-semibold text-muted-foreground/70 block mb-2">
            3-Day Outlook
          </span>
          <div className="grid grid-cols-3 gap-2">
            {forecast.map((dayItem) => (
              <div
                key={dayItem.date}
                className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl border border-white/5 flex flex-col items-center gap-1 transition-colors"
              >
                <span className="text-xs font-display font-medium text-foreground/70">
                  {dayItem.day}
                </span>
                {renderWeatherIcon(dayItem.condition.icon, 'w-4 h-4')}
                <div className="text-[11px] font-mono mt-0.5">
                  <span className="text-foreground font-semibold">{dayItem.maxTemp}°</span>
                  <span className="text-muted-foreground/60 ml-1">{dayItem.minTemp}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

WeatherWidget.propTypes = {
  coordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  locationName: PropTypes.string,
};

export default WeatherWidget;
