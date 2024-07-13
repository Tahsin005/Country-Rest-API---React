import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const CountryDetails = () => {
  const params = useParams();
  const { state } = useLocation();
  const countryName = params.countryName;
  const navigate = useNavigate();

  const [countryData, setCountryData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  console.log(countryName);
  console.log(state);
  const handleBackButton = () => {
    setCountryData(null);
    navigate(-1);
  };

  function updateCountryData(data) {
    setCountryData({
      name: data.name.common || data.name,
      nativeName: Object.values(data.name.nativeName || {})[0]?.common,
      population: data.population,
      region: data.region,
      subregion: data.subregion,
      capital: data.capital,
      flag: data.flags.svg,
      tld: data.tld,
      languages: Object.values(data.languages || {}).join(", "),
      currencies: Object.values(data.currencies || {})
        .map((currency) => currency.name)
        .join(", "),
      borders: [],
    });

    if (!data.borders) {
      data.borders = [];
    }

    Promise.all(
      data.borders.map((border) => {
        return fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((res) => res.json())
          .then(([borderCountry]) => borderCountry.name.common);
      })
    ).then((borders) => {
      setTimeout(() =>
        setCountryData((prevState) => ({ ...prevState, borders }))
      );
    });
  }

  useEffect(() => {
    if (state) {
      updateCountryData(state);
      return;
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
      .then((res) => res.json())
      .then(([data]) => {
        updateCountryData(data);
      })
      .catch((err) => {
        console.log(err);
        setNotFound(true);
      });
  }, [countryName]);

  if (notFound) {
    return <div className="mt-24 font-bold text-5xl"><h1>Country Not Found</h1></div>;
  }

  return (
    <div className="">
      <div className="text-start max-w-screen-xl mx-auto px-8 md:px-16 lg:px-24">
        <button
          className="bg-slate-200 px-4 py-2
            rounded-full hover:scale-105 duration-200"
          onClick={handleBackButton}
        >🡬 Back
        </button>
      </div>
      {countryData ? (
        <div className="lg:flex mt-12 md:justify-evenly max-w-screen-xl mx-auto px-8 md:px-16 lg:px-24 py-5 gap-x-8">
          {/* image */}
          <div className="flex justify-start">
            <div className="">
              <img
                className="border-b-2 w-full lg:max-w-xl h-full object-cover rounded-xl"
                src={countryData.flag}
                alt=""
              />
            </div>
          </div>
          {/* text */}
          <div className="lg:my-auto sm:mt-8 md:mt-8">
            <div>
              <p className="text-start text-2xl font-bold">
                <b>Native Name: {countryData.nativeName || countryData.name}</b>
                <span className="native-name"></span>
              </p>
            </div>

            <div className="lg:flex gap-x-8 mt-4">
              <div className="text-start">
                <p>
                  <b>
                    Population: {countryData.population.toLocaleString("en-IN")}
                  </b>
                  <span className="population"></span>
                </p>

                <p>
                  <b>Region: {countryData.region}</b>
                  <span className="region"></span>
                </p>
                <p>
                  <b>Sub Region: {countryData.subregion}</b>
                  <span className="sub-region"></span>
                </p>
                <p>
                  <b>Capital: {countryData.capital?.join(", ")}</b>
                  <span className="capital"></span>
                </p>
              </div>

              <div className="text-start">
                <p>
                  <b>Top Level Domain: {countryData.tld}</b>
                  <span className="top-level-domain"></span>
                </p>
                <p>
                  <b>Currencies: {countryData.currencies}</b>
                  <span className="currencies"></span>
                </p>
                <p>
                  <b>Languages: {countryData.languages}</b>
                  <span className="languages"></span>
                </p>
              </div>
            </div>

            <div className="text-start">
            {countryData.borders.length !== 0 && (
                <div className="gap-x-4">
                  <b>Border Countries: </b>
                  {countryData.borders.map((border) => (
                    <Link className="px-4 py-1 shadow border rounded text-sm font-semibold" key={border} to={`/country/${border}`}>
                      {border}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CountryDetails;
