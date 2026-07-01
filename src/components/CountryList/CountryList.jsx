import { useEffect, useState, useMemo, useRef } from "react";
import CountryCard from "../CountryCard/CountryCard";
import PropTypes from 'prop-types';
import ShimmerList from "../ShimmerList/ShimmerList";
import { countryApi } from "../../services/api";
import { Globe } from 'lucide-react';

const CountryList = ({ search, region, sortBy }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const initialMount = useRef(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data = await countryApi.getAll();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        hasLoaded.current = true;
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }

    if (!hasLoaded.current) return;

    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [search, region, sortBy]);

  const filteredAndSortedCountries = useMemo(() => {
    return countries
      .filter((country) => {
        const matchesSearch = country.names.common.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = region === '' || country.region === region;
        return matchesSearch && matchesRegion;
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
  }, [countries, search, region, sortBy]);

  if (loading || isFiltering) return <ShimmerList />;

  if (error) return (
    <div
      className="glass"
      style={{
        maxWidth: '400px',
        margin: '48px auto',
        padding: '28px 32px',
        textAlign: 'center',
      }}
    >
      <p style={{ color: '#8B3A3A', fontSize: '14px', fontWeight: '500', margin: 0 }}>
        {error}
      </p>
    </div>
  );

  return (
    <div style={{ minHeight: '400px' }}>
      {filteredAndSortedCountries.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '60px',
          }}
        >
          {filteredAndSortedCountries.map((country) => (
            <CountryCard key={country.codes?.alpha_3} country={country} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Globe style={{ width: '48px', height: '48px', color: 'rgba(60,60,67,0.20)' }} />
          <div>
            <p style={{ fontSize: '18px', fontWeight: '600', color: 'rgba(60,60,67,0.30)', margin: '0 0 4px' }}>
              No countries found
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(60,60,67,0.22)', margin: 0 }}>
              Try adjusting your search or region filter
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
};

CountryList.defaultProps = {
  search: '',
  region: '',
  sortBy: 'name',
};

export default CountryList;