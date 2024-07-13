import { useEffect, useState } from "react";
import CountryCard from "../CountryCard/CountryCard";
import PropTypes from 'prop-types';
const CountryList = ({query}) => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
        .then((response) => response.json())
        .then((data) => setCountries(data))
    }, []);
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-12">
            {
                countries ? 
                countries.filter((country) => country.name.common.toLowerCase().includes(query) || country.region.toLowerCase().includes(query)).map((country) => (
                    <CountryCard key={country.name.common} country={country}></CountryCard>
                )) 
                : 
                <div>nai</div>
            }
        </div>
    );
};

CountryList.propTypes = {
    query: PropTypes.object
}

export default CountryList;