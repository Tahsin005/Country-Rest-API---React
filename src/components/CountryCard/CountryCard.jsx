import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Users, Globe2, Landmark, Heart } from 'lucide-react';
import { favoritesStorage } from '../../services/favoritesStorage';

const CountryCard = ({ country }) => {
  const [isSaved, setIsSaved] = useState(false);

  const countryCode = country.codes?.alpha_3 || country.names?.common;

  useEffect(() => {
    setIsSaved(favoritesStorage.isFavorite(countryCode));
    const unsubscribe = favoritesStorage.subscribe(() => {
      setIsSaved(favoritesStorage.isFavorite(countryCode));
    });
    return unsubscribe;
  }, [countryCode]);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = favoritesStorage.toggleFavorite(country);
    setIsSaved(updated);
  };

  return (
    <Link
      to={`/country/${country.names.common}`}
      className="glass-card glass-hover glass-shimmer group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-primary/40 relative"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="relative h-44 overflow-hidden rounded-t-2xl flex-shrink-0 bg-white/5">
        <img
          src={country.flag?.url_svg || 'https://placehold.co/600x400'}
          alt={`${country.names.common} flag`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c1a] via-transparent to-black/30 pointer-events-none" />

        <div className="absolute bottom-3 left-3">
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-foreground border border-white/15">
            {country.codes?.alpha_3 || '—'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            isSaved
              ? 'bg-rose-500/30 border-rose-500/50 text-rose-400 scale-105'
              : 'bg-black/40 border-white/15 text-white/70 hover:bg-black/60 hover:text-white'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-grow">
        <h3 className="font-display font-bold text-lg text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {country.names.common}
        </h3>

        <div className="flex flex-col space-y-2.5 text-xs font-display">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Population</span>
            </div>
            <span className="font-mono font-medium text-foreground">
              {country.population ? country.population.toLocaleString() : '—'}
            </span>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe2 className="w-3.5 h-3.5 text-accent-2" />
              <span>Region</span>
            </div>
            <span className="font-medium text-foreground">{country.region}</span>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Landmark className="w-3.5 h-3.5 text-accent-3" />
              <span>Capital</span>
            </div>
            <span className="font-medium text-foreground truncate max-w-[120px]">
              {country.capitals?.[0]?.name || '—'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

CountryCard.propTypes = {
  country: PropTypes.shape({
    names: PropTypes.shape({
      common: PropTypes.string.isRequired,
    }).isRequired,
    codes: PropTypes.shape({
      alpha_3: PropTypes.string,
    }),
    flag: PropTypes.shape({
      url_svg: PropTypes.string,
    }),
    population: PropTypes.number,
    region: PropTypes.string,
    capitals: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default CountryCard;
