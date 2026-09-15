import { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAllCountries, useWeather } from '../../hooks/useQueries';
import CapitalClock from '../CapitalClock/CapitalClock';
import { Scale, Sun, ArrowRightLeft, ChevronDown } from 'lucide-react';

const MetricBar = ({ label, valueA, valueB, format = (v) => v?.toLocaleString() || '—', unit = '' }) => {
  const numA = Number(valueA) || 0;
  const numB = Number(valueB) || 0;
  const total = numA + numB || 1;
  const pctA = Math.round((numA / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="glass-card p-5 rounded-2xl mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-sm font-semibold text-primary">
          {format(valueA)} {unit}
        </span>
        <span className="section-label text-[11px]">{label}</span>
        <span className="font-mono text-sm font-semibold text-accent-2">
          {format(valueB)} {unit}
        </span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden flex">
        <div
          style={{ width: `${pctA}%` }}
          className="h-full bg-gradient-to-r from-primary to-accent-3 transition-all duration-700"
        />
        <div
          style={{ width: `${pctB}%` }}
          className="h-full bg-gradient-to-r from-accent-2 to-fuchsia-400 transition-all duration-700"
        />
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
        <span>{pctA}%</span>
        <span>{pctB}%</span>
      </div>
    </div>
  );
};

MetricBar.propTypes = {
  label: PropTypes.string.isRequired,
  valueA: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueB: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  format: PropTypes.func,
  unit: PropTypes.string,
};

const CountrySelect = ({ label, labelColor = 'text-primary', value, onChange, countries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = countries.find(
    (c) => c.names?.common?.toLowerCase() === value?.toLowerCase()
  );

  const filteredCountries = countries.filter((c) =>
    c.names?.common?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`glass-panel p-5 relative ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
      <label className={`section-label block mb-2 ${labelColor}`}>{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-input flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl font-display font-medium text-sm text-foreground hover:border-white/20 transition-colors w-full text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedCountry?.flag?.url_svg && (
            <img
              src={selectedCountry.flag.url_svg}
              alt=""
              className="w-5 h-3.5 object-cover rounded flex-shrink-0"
            />
          )}
          <span className="truncate font-semibold">
            {selectedCountry ? `${selectedCountry.names.common} (${selectedCountry.region})` : 'Select Country'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="glass-panel absolute top-[calc(100%+8px)] left-0 right-0 p-2 z-[60] flex flex-col gap-1 shadow-2xl border border-white/10"
          style={{
            background: 'rgba(22, 18, 42, 0.98)',
            backdropFilter: 'blur(40px)',
          }}
        >
          <div className="p-1 mb-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="glass-input text-xs py-2 px-3 w-full"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-[260px] overflow-y-auto space-y-0.5 pr-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const isSelected = c.names.common === value;
                return (
                  <button
                    key={c.names.common}
                    type="button"
                    onClick={() => {
                      onChange(c.names.common);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg font-display text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {c.flag?.url_svg && (
                        <img src={c.flag.url_svg} alt="" className="w-4 h-3 object-cover rounded flex-shrink-0" />
                      )}
                      <span className="truncate">{c.names.common}</span>
                    </div>
                    <span className="text-[10px] opacity-60 font-mono ml-2 flex-shrink-0">{c.region}</span>
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-muted-foreground font-display">
                No country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CountrySelect.propTypes = {
  label: PropTypes.string.isRequired,
  labelColor: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  countries: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Compare = () => {
  const { data: countries = [], isLoading: loading } = useAllCountries();
  const [countryAId, setCountryAId] = useState('United States');
  const [countryBId, setCountryBId] = useState('Japan');

  const countryA = useMemo(() => {
    return countries.find(
      (c) => c.names?.common?.toLowerCase() === countryAId.toLowerCase()
    );
  }, [countries, countryAId]);

  const countryB = useMemo(() => {
    return countries.find(
      (c) => c.names?.common?.toLowerCase() === countryBId.toLowerCase()
    );
  }, [countries, countryBId]);

  // Load weather for both capitals using TanStack Query
  const coordsA = countryA?.capitals?.[0]?.coordinates;
  const coordsB = countryB?.capitals?.[0]?.coordinates;

  const { data: weatherA } = useWeather(coordsA?.lat, coordsA?.lng);
  const { data: weatherB } = useWeather(coordsB?.lat, coordsB?.lng);

  const densityA = countryA?.population && countryA?.area?.kilometers
    ? Math.round(countryA.population / countryA.area.kilometers)
    : 0;

  const densityB = countryB?.population && countryB?.area?.kilometers
    ? Math.round(countryB.population / countryB.area.kilometers)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <Scale className="w-4 h-4 text-primary" />
          <span className="section-label text-[10px]">Comparative Intelligence</span>
        </div>
        <h1 className="font-display text-[clamp(36px,6vw,64px)] font-bold tracking-tighter mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Compare{' '}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-2">
            Nations
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Analyze demographics, geography, climate, and live metrics between any two countries side by side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-30">
        <CountrySelect
          label="Country 1"
          labelColor="text-primary"
          value={countryAId}
          onChange={setCountryAId}
          countries={countries}
        />

        <CountrySelect
          label="Country 2"
          labelColor="text-accent-2"
          value={countryBId}
          onChange={setCountryBId}
          countries={countries}
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
        </div>
      ) : countryA && countryB ? (
        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card glass-shimmer p-6 md:p-8 rounded-2xl border-l-4 border-l-primary flex flex-col justify-between">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={countryA.flag?.url_svg || 'https://placehold.co/600x400'}
                  alt={countryA.names.common}
                  className="w-20 h-14 object-cover rounded-xl border border-white/10 shadow-lg flex-shrink-0"
                />
                <div>
                  <span className="text-[11px] font-mono text-primary font-bold tracking-wider">
                    {countryA.codes?.alpha_3}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {countryA.names.common}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {countryA.names?.native ? Object.values(countryA.names.native)[0]?.common : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <CapitalClock
                  capitalName={countryA.capitals?.[0]?.name}
                  timezoneStr={countryA.timezones?.[0]}
                  coordinates={countryA.capitals?.[0]?.coordinates}
                />
                {weatherA?.current && (
                  <div className="glass-pill px-3 py-1.5 text-xs flex items-center gap-1.5 font-display font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{weatherA.current.temperature}°C, {weatherA.current.condition.label}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card glass-shimmer p-6 md:p-8 rounded-2xl border-l-4 border-l-accent-2 flex flex-col justify-between">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={countryB.flag?.url_svg || 'https://placehold.co/600x400'}
                  alt={countryB.names.common}
                  className="w-20 h-14 object-cover rounded-xl border border-white/10 shadow-lg flex-shrink-0"
                />
                <div>
                  <span className="text-[11px] font-mono text-accent-2 font-bold tracking-wider">
                    {countryB.codes?.alpha_3}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {countryB.names.common}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {countryB.names?.native ? Object.values(countryB.names.native)[0]?.common : ''}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <CapitalClock
                  capitalName={countryB.capitals?.[0]?.name}
                  timezoneStr={countryB.timezones?.[0]}
                  coordinates={countryB.capitals?.[0]?.coordinates}
                />
                {weatherB?.current && (
                  <div className="glass-pill px-3 py-1.5 text-xs flex items-center gap-1.5 font-display font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{weatherB.current.temperature}°C, {weatherB.current.condition.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="section-label mb-4 text-center">Core Dimensions Comparison</div>
            <MetricBar
              label="Total Population"
              valueA={countryA.population}
              valueB={countryB.population}
            />
            <MetricBar
              label="Surface Area"
              valueA={countryA.area?.kilometers}
              valueB={countryB.area?.kilometers}
              unit="km²"
            />
            <MetricBar
              label="Population Density"
              valueA={densityA}
              valueB={densityB}
              unit="people/km²"
            />
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="section-label text-xs">Direct Parameter Matrix</span>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-primary font-bold">{countryA.names.common}</span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-accent-2 font-bold">{countryB.names.common}</span>
              </div>
            </div>

            <div className="divide-y divide-white/5 text-sm font-display">
              <div className="grid grid-cols-3 p-4 items-center">
                <span className="text-muted-foreground text-xs uppercase font-semibold">Region / Subregion</span>
                <span className="text-foreground">{countryA.region} · {countryA.subregion || '—'}</span>
                <span className="text-foreground">{countryB.region} · {countryB.subregion || '—'}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="text-muted-foreground text-xs uppercase font-semibold">Capital City</span>
                <span className="text-foreground">{countryA.capitals?.map(c => c.name).join(', ') || '—'}</span>
                <span className="text-foreground">{countryB.capitals?.map(c => c.name).join(', ') || '—'}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="text-muted-foreground text-xs uppercase font-semibold">Official Currency</span>
                <span className="text-foreground font-mono">
                  {countryA.currencies?.[0]?.name} ({countryA.currencies?.[0]?.code || '—'})
                </span>
                <span className="text-foreground font-mono">
                  {countryB.currencies?.[0]?.name} ({countryB.currencies?.[0]?.code || '—'})
                </span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="text-muted-foreground text-xs uppercase font-semibold">Driving Side</span>
                <span className="text-foreground capitalize">{countryA.cars?.driving_side || 'Right'}</span>
                <span className="text-foreground capitalize">{countryB.cars?.driving_side || 'Right'}</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="text-muted-foreground text-xs uppercase font-semibold">Land Borders Count</span>
                <span className="text-foreground font-mono">{countryA.borders?.length || 0} nations</span>
                <span className="text-foreground font-mono">{countryB.borders?.length || 0} nations</span>
              </div>

              <div className="grid grid-cols-3 p-4 items-center">
                <span className="text-muted-foreground text-xs uppercase font-semibold">Internet Domain</span>
                <span className="text-foreground font-mono">{countryA.tlds?.[0] || '—'}</span>
                <span className="text-foreground font-mono">{countryB.tlds?.[0] || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Compare;
