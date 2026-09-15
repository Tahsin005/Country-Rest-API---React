import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon } from 'lucide-react';

const parseUtcOffsetMinutes = (timezoneStr) => {
  if (!timezoneStr || typeof timezoneStr !== 'string') return 0;
  // Examples: 'UTC+03:00', 'UTC-05:00', 'UTC+05:30', 'UTC'
  const match = timezoneStr.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return sign * (hours * 60 + minutes);
};

const CapitalClock = ({ capitalName, timezoneStr, coordinates }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute country local time
  let localDate = new Date();
  let offsetMinutes = 0;

  if (timezoneStr) {
    offsetMinutes = parseUtcOffsetMinutes(timezoneStr);
    const utcTime = time.getTime() + time.getTimezoneOffset() * 60000;
    localDate = new Date(utcTime + offsetMinutes * 60000);
  } else if (coordinates?.lng !== undefined) {
    // Approximate by longitude: 15 degrees ~ 1 hour = 4 min/deg
    offsetMinutes = Math.round(coordinates.lng * 4);
    const utcTime = time.getTime() + time.getTimezoneOffset() * 60000;
    localDate = new Date(utcTime + offsetMinutes * 60000);
  }

  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const seconds = localDate.getSeconds();
  const isDay = hours >= 6 && hours < 19;

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const dateString = localDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="glass-pill px-4 py-2.5 flex items-center gap-3 border border-white/10 shadow-lg"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center border"
        style={{
          background: isDay ? 'rgba(234, 179, 8, 0.15)' : 'rgba(139, 92, 246, 0.2)',
          borderColor: isDay ? 'rgba(234, 179, 8, 0.3)' : 'rgba(139, 92, 246, 0.3)',
        }}
      >
        {isDay ? (
          <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
        ) : (
          <Moon className="w-4 h-4 text-violet-300" />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
            {timeString}
          </span>
          <span className="text-[10px] uppercase font-display font-bold px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
            {timezoneStr ? timezoneStr.replace('UTC', '') || 'UTC' : 'Local'}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground font-display">
          {capitalName ? `${capitalName} · ` : ''}{dateString}
        </span>
      </div>
    </div>
  );
};

CapitalClock.propTypes = {
  capitalName: PropTypes.string,
  timezoneStr: PropTypes.string,
  coordinates: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
};

export default CapitalClock;
