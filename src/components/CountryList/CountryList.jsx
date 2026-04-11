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
                if (sortBy === 'name') {
                    return a.name.common.localeCompare(b.name.common);
                } else if (sortBy === 'population') {
                    return b.population - a.population;
                } else if (sortBy === 'area') {
                    return b.area - a.area;
                }
                return 0;
            });
    }, [countries, search, region, sortBy]);

    if (loading) return <ShimmerList />;
    
    if (error) return (
        <div className="alert alert-error glass-effect max-w-md mx-auto my-12">
            <span>Error: {error}</span>
        </div>
    );

    return (
        <div className="min-h-[400px]">
            {filteredAndSortedCountries.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
                    {filteredAndSortedCountries.map((country) => (
                        <CountryCard key={country.cca3} country={country} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 opacity-20 flex flex-col items-center gap-6">
                    <Globe className="w-24 h-24 animate-pulse" />
                    <div className="flex flex-col gap-2">
                        <p className="text-2xl font-black uppercase tracking-[0.2em]">Sector Out of Range</p>
                        <p className="text-xs font-bold uppercase tracking-widest">No geographic matches found in current registry</p>
                    </div>
                </div>
            )}
        </div>
    );
};


CountryList.propTypes = {
    search: PropTypes.string,
    region: PropTypes.string,
    sortBy: PropTypes.string
};

CountryList.defaultProps = {
    search: '',
    region: '',
    sortBy: 'name'
};

export default CountryList;