import { useEffect, useState, useMemo } from "react";
import CountryCard from "../CountryCard/CountryCard";
import PropTypes from 'prop-types';
import ShimmerList from "../ShimmerList/ShimmerList";
import { countryApi } from "../../services/api";
import { Globe } from 'lucide-react';

const CountryList = ({ search, region, sortBy }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      }
    };

    fetchCountries();
  }, []);

  const filteredAndSortedCountries = useMemo(() => {
    return countries
      .filter((country) => {
        const matchesSearch = country.name.common.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = region === '' || country.region === region;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.common.localeCompare(b.name.common);
        if (sortBy === 'population') return b.population - a.population;
        if (sortBy === 'area') return b.area - a.area;
        return 0;
      });
  }, [countries, search, region, sortBy]);

  if (loading) return <ShimmerList />;

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
            <CountryCard key={country.cca3} country={country} />
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