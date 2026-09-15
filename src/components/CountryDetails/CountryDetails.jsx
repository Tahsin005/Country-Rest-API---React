import { useState, useMemo } from "react";
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCountryByName, useBorderCountries } from "../../hooks/useQueries";
import { favoritesStorage } from "../../services/favoritesStorage";
import ShimmerDetails from "../ShimmerDetails/ShimmerDetails";
import CapitalClock from "../CapitalClock/CapitalClock";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import CurrencyConverter from "../CurrencyConverter/CurrencyConverter";
import InteractiveMap from "../InteractiveMap/InteractiveMap";
import WikiSummary from "../WikiSummary/WikiSummary";
import HolidaysList from "../HolidaysList/HolidaysList";
import {
  ArrowLeft, Map, Users, Languages,
  Coins, Car, ExternalLink, Landmark,
  Globe, Heart, ShieldCheck, Share2
} from 'lucide-react';

const StatRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-none">
    <div className="flex items-center gap-2.5 text-muted-foreground">
      {Icon && <Icon className="w-4 h-4 text-primary flex-shrink-0" />}
      <span className="font-display text-xs">{label}</span>
    </div>
    <span className="font-display text-sm font-semibold text-foreground text-right">
      {value || '—'}
    </span>
  </div>
);

StatRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.elementType,
};

const SectionHeader = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
    {Icon && <Icon className="w-4 h-4 text-primary" />}
    <span className="section-label text-xs tracking-wider">{label}</span>
  </div>
);

SectionHeader.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
};

const CountryDetails = () => {
  const { countryName } = useParams();
  const navigate = useNavigate();

  const { data: rawCountryData, isLoading, isError } = useCountryByName(countryName);
  const { data: borderCountriesData = [] } = useBorderCountries(rawCountryData?.borders);

  const [copied, setCopied] = useState(false);

  const countryData = useMemo(() => {
    if (!rawCountryData) return null;

    const primaryCurrency = rawCountryData.currencies?.[0];
    const capitalObj = rawCountryData.capitals?.[0];

    const borderNames = borderCountriesData.map((c) => c.names?.common || c.codes?.alpha_3);

    return {
      name: rawCountryData.names?.common,
      nativeName: rawCountryData.names?.native ? Object.values(rawCountryData.names.native)[0]?.common : undefined,
      population: rawCountryData.population,
      area: rawCountryData.area?.kilometers,
      region: rawCountryData.region,
      subregion: rawCountryData.subregion,
      capital: rawCountryData.capitals?.map((c) => c.name),
      capitalName: capitalObj?.name || '',
      capitalCoords: capitalObj?.coordinates || rawCountryData.coordinates,
      coordinates: rawCountryData.coordinates,
      flag: rawCountryData.flag?.url_svg,
      tld: rawCountryData.tlds?.[0],
      languages: rawCountryData.languages?.map((l) => l.name).join(', '),
      currencies: rawCountryData.currencies?.map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`).join(', '),
      currencyCode: primaryCurrency?.code || '',
      currencySymbol: primaryCurrency?.symbol || '',
      currencyName: primaryCurrency?.name || '',
      borders: borderNames.length > 0 ? borderNames : (rawCountryData.borders || []),
      maps: rawCountryData.links?.google_maps,
      carSide: rawCountryData.cars?.driving_side,
      cca3: rawCountryData.codes?.alpha_3,
      cca2: rawCountryData.codes?.alpha_2,
      timezones: rawCountryData.timezones,
      memberships: rawCountryData.memberships || {},
    };
  }, [rawCountryData, borderCountriesData]);

  const isSaved = favoritesStorage.isFavorite(countryData?.cca3 || countryData?.name);

  const handleBackButton = () => navigate(-1);

  const handleToggleFavorite = () => {
    if (!countryData) return;
    favoritesStorage.toggleFavorite(countryData);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <ShimmerDetails />;

  if (isError || !countryData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground/20 mb-4 tracking-tighter">
          Not Found
        </h1>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          The requested country could not be located in the planetary registry.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary-glass">
          Return to World Atlas
        </button>
      </div>
    );
  }

  const activeMemberships = Object.entries(countryData.memberships)
    .filter(([, active]) => Boolean(active))
    .map(([org]) => org.replace('_', ' ').toUpperCase());

  return (
    <div className="min-h-screen pb-24">
      <div className="relative w-full min-h-[420px] overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-[-40px] pointer-events-none"
          style={{
            backgroundImage: `url(${countryData.flag})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(60px) saturate(200%) brightness(0.55)',
            opacity: 0.45,
            zIndex: 0,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(13, 10, 25, 0.75) 70%, hsl(var(--background)) 100%)',
            zIndex: 1,
          }}
        />

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 relative z-10 flex flex-col justify-between h-full min-h-[420px]">
          <div className="flex items-center justify-between mb-12">
            <button
              type="button"
              onClick={handleBackButton}
              className="glass-pill px-4 py-2 flex items-center gap-2 text-xs font-display font-semibold hover:border-white/30 text-foreground transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="glass-pill px-3 py-2 flex items-center gap-1.5 text-xs font-display font-semibold text-muted-foreground hover:text-foreground transition-all"
                title="Copy share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`glass-pill px-4 py-2 flex items-center gap-2 text-xs font-display font-semibold transition-all ${
                  isSaved
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'text-foreground hover:border-white/30'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
              </button>

              <div className="glass-pill px-3.5 py-2 font-mono text-xs font-bold text-primary border border-primary/30">
                {countryData.cca3}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 pt-6">
            <div className="glass-card p-2.5 rounded-2xl flex-shrink-0 shadow-2xl border border-white/20 w-44 md:w-56 bg-black/40">
              <img
                src={countryData.flag || 'https://placehold.co/600x400'}
                alt={`${countryData.name} flag`}
                className="w-full h-28 md:h-36 object-contain rounded-xl"
              />
            </div>

            <div className="flex-1 space-y-1">
              <span className="section-label text-xs tracking-wider text-primary">
                {countryData.nativeName || countryData.name}
              </span>
              <h1 className="font-display text-[clamp(36px,6vw,72px)] font-bold tracking-tighter text-foreground leading-none">
                {countryData.name}
              </h1>
              <p className="text-sm font-display text-muted-foreground pt-1">
                {countryData.region} {countryData.subregion ? `· ${countryData.subregion}` : ''}
              </p>
            </div>

            <div className="flex-shrink-0 self-start md:self-end">
              <CapitalClock
                capitalName={countryData.capitalName}
                timezoneStr={countryData.timezones?.[0]}
                coordinates={countryData.capitalCoords}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-10 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="section-label text-[10px] block">Population</span>
              <span className="font-mono text-base font-bold text-foreground">
                {countryData.population ? countryData.population.toLocaleString() : '—'}
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent-2/15 border border-accent-2/30 flex items-center justify-center flex-shrink-0">
              <Map className="w-5 h-5 text-accent-2" />
            </div>
            <div>
              <span className="section-label text-[10px] block">Total Area</span>
              <span className="font-mono text-base font-bold text-foreground">
                {countryData.area ? `${countryData.area.toLocaleString()} km²` : '—'}
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent-3/15 border border-accent-3/30 flex items-center justify-center flex-shrink-0">
              <Landmark className="w-5 h-5 text-accent-3" />
            </div>
            <div>
              <span className="section-label text-[10px] block">Capital City</span>
              <span className="font-display text-sm font-bold text-foreground truncate block max-w-[140px]">
                {countryData.capital?.join(', ') || '—'}
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="section-label text-[10px] block">Global Sector</span>
              <span className="font-display text-sm font-bold text-foreground truncate block max-w-[140px]">
                {countryData.region}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeatherWidget
            coordinates={countryData.capitalCoords || countryData.coordinates}
            locationName={countryData.capitalName || countryData.name}
          />

          <InteractiveMap
            lat={countryData.coordinates?.lat || countryData.capitalCoords?.lat}
            lng={countryData.coordinates?.lng || countryData.capitalCoords?.lng}
            countryName={countryData.name}
            capitalName={countryData.capitalName}
            flagUrl={countryData.flag}
          />
        </div>

        <WikiSummary countryName={countryData.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrencyConverter
            baseCurrencyCode={countryData.currencyCode}
            baseCurrencyName={countryData.currencyName}
            baseCurrencySymbol={countryData.currencySymbol}
          />

          <HolidaysList
            alpha2Code={countryData.cca2}
            countryName={countryData.name}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            <SectionHeader icon={Globe} label="Technical Indicators" />
            <div className="space-y-1">
              <StatRow label="Languages" value={countryData.languages} icon={Languages} />
              <StatRow label="Currencies" value={countryData.currencies} icon={Coins} />
              <StatRow
                label="Traffic Orientation"
                value={countryData.carSide === 'left' ? '← Drive on Left' : '→ Drive on Right'}
                icon={Car}
              />
              <StatRow label="Internet Top-Level Domain" value={countryData.tld} icon={Globe} />
            </div>

            {activeMemberships.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="section-label text-[10px]">Alliances & Treaties</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeMemberships.map((org) => (
                    <span
                      key={org}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-display font-semibold text-foreground/80 tracking-wide"
                    >
                      {org}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <SectionHeader icon={Map} label="Territorial Neighbors" />
              {countryData.borders && countryData.borders.length > 0 ? (
                <div className="flex flex-wrap gap-2 py-2">
                  {countryData.borders.map((neighbor) => (
                    <Link
                      key={neighbor}
                      to={`/country/${neighbor}`}
                      className="glass-pill px-3.5 py-2 text-xs font-display font-semibold text-foreground hover:text-primary hover:border-primary/40 transition-all text-decoration-none"
                    >
                      {neighbor}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm font-display italic">
                  Maritime / island state with no immediate land borders.
                </div>
              )}
            </div>

            {countryData.maps && (
              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href={countryData.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-glass w-full justify-center text-xs font-display font-semibold"
                >
                  <span>Open External Satellite Map</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;