import { useState, useEffect, useMemo } from "react";
import PropTypes from 'prop-types';
import CountryCard from "../CountryCard/CountryCard";
import ShimmerList from "../ShimmerList/ShimmerList";
import { useAllCountries } from "../../hooks/useQueries";
import { favoritesStorage } from "../../services/favoritesStorage";
import { Globe, AlertCircle } from 'lucide-react';

const CountryList = ({ search = '', region = '', sortBy = 'name', showSavedOnly = false }) => {
  const { data: countries = [], isLoading, error } = useAllCountries();
  const [favorites, setFavorites] = useState(favoritesStorage.getFavorites());

  useEffect(() => {
    const unsubscribe = favoritesStorage.subscribe((favs) => {
      setFavorites(favs);
    });
    return unsubscribe;
  }, []);

  const filteredAndSortedCountries = useMemo(() => {
    return countries
      .filter((country) => {
        const name = country.names?.common?.toLowerCase() || '';
        const matchesSearch = name.includes(search.toLowerCase());
        const matchesRegion = region === '' || country.region === region;

        let matchesSaved = true;
        if (showSavedOnly) {
          const code = country.codes?.alpha_3?.toLowerCase() || '';
          matchesSaved = favorites.some((f) =>
            (f.code && f.code.toLowerCase() === code) ||
            (f.name && f.name.toLowerCase() === name)
          );
        }

        return matchesSearch && matchesRegion && matchesSaved;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          const nameA = a.names?.common || '';
          const nameB = b.names?.common || '';
          return nameA.localeCompare(nameB);
        }
        if (sortBy === 'population') {
          return (b.population || 0) - (a.population || 0);
        }
        if (sortBy === 'area') {
          return (b.area?.kilometers || 0) - (a.area?.kilometers || 0);
        }
        return 0;
      });
  }, [countries, search, region, sortBy, showSavedOnly, favorites]);

  if (isLoading) return <ShimmerList />;

  if (error) {
    return (
      <div className="glass-card max-w-md mx-auto p-8 text-center rounded-2xl border border-rose-500/30">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-rose-300 mb-1">Failed to connect to Atlas Network</p>
        <p className="text-xs text-muted-foreground">{error?.message || 'Network error'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      {filteredAndSortedCountries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredAndSortedCountries.map((country) => (
            <CountryCard
              key={country.codes?.alpha_3 || country.names?.common}
              country={country}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center rounded-3xl max-w-lg mx-auto flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-foreground mb-1">
              No matching records found
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {showSavedOnly
                ? 'You have not bookmarked any countries yet. Click the heart icon on any card to save it!'
                : 'Try adjusting your search criteria or changing the region filter to scan other sectors.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

CountryList.propTypes = {
  search: PropTypes.string,
  region: PropTypes.string,
  sortBy: PropTypes.string,
  showSavedOnly: PropTypes.bool,
};

export default CountryList;