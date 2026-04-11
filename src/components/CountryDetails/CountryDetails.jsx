import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { countryApi } from "../../services/api";
import { 
  ArrowLeft, Map, Globe, Users, Languages, 
  Coins, Car, ExternalLink, Info, Landmark, 
  Navigation, LayoutGrid 
} from 'lucide-react';

const CountryDetails = () => {
  const params = useParams();
  const { state } = useLocation();
  const countryName = params.countryName;
  const navigate = useNavigate();

  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const handleBackButton = () => {
    navigate(-1);
  };

  const processCountryData = async (data) => {
    const processed = {
      name: data.name.common,
      nativeName: Object.values(data.name.nativeName || {})[0]?.common,
      population: data.population,
      region: data.region,
      subregion: data.subregion,
      capital: data.capital,
      flag: data.flags.svg,
      coatOfArms: data.coatOfArms?.svg || data.coatOfArms?.png,
      tld: data.tld?.[0],
      languages: Object.values(data.languages || {}).join(", "),
      currencies: Object.values(data.currencies || {})
        .map((c) => `${c.name} (${c.symbol || ''})`)
        .join(", "),
      borders: [],
      maps: data.maps?.googleMaps,
      carSide: data.car?.side,
      cca3: data.cca3,
    };

    setCountryData(processed);
    setLoading(false);

    if (data.borders && data.borders.length > 0) {
      try {
        const borderCountries = await countryApi.getByCodes(data.borders);
        setCountryData(prev => ({
          ...prev,
          borders: borderCountries.map(c => c.name.common)
        }));
      } catch (err) {
        console.error("Failed to fetch borders", err);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await countryApi.getByName(countryName);
        if (isMounted) {
          processCountryData(data);
        }
      } catch (err) {
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [countryName]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
      <Globe className="w-12 h-12 text-primary animate-spin opacity-20" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Scanning Sector...</span>
    </div>
  );

  if (notFound) {
    return (
      <div className="mt-24 text-center">
        <h1 className="text-5xl font-black opacity-10 uppercase italic">Entry Deleted</h1>
        <button onClick={() => navigate('/')} className="mt-8 btn btn-primary px-12">Return to Nav</button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 min-h-screen pb-20">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-8">
        <div className="flex items-center justify-between mb-12">
          <button
            className="btn btn-ghost glass-effect gap-3 hover:scale-105 transition-all text-xs font-black uppercase tracking-widest border border-base-content/10"
            onClick={handleBackButton}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Grid
          </button>
          <div className="flex items-center gap-4 text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">
            <span>Registry {countryData?.cca3}</span>
            <div className="w-12 h-[1px] bg-current" />
            <span>Digital Cartography v3.1</span>
          </div>
        </div>

        {countryData && (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="map-module overflow-hidden group">
                <img
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={countryData.flag}
                  alt={`${countryData.name} identifier`}
                />
              </div>
              
              {countryData.coatOfArms && (
                <div className="p-8 map-module flex flex-col items-center gap-6 group hover:border-primary/30 transition-colors">
                  <header className="flex items-center gap-2 w-full">
                    <LayoutGrid className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Symbolic Identity</span>
                  </header>
                  <img src={countryData.coatOfArms} className="h-40 w-auto group-hover:scale-110 transition-transform duration-500" alt="Emblem" />
                </div>
              )}
            </div>

            {/* Data Column */}
            <div className="lg:col-span-7 space-y-8">
              <header className="border-l-4 border-primary pl-6 py-2">
                <h1 className="text-5xl md:text-7xl font-black mb-2 uppercase tracking-tighter italic">{countryData.name}</h1>
                <p className="text-sm opacity-50 font-bold uppercase tracking-[0.2em]">
                  Index: <span className="text-primary">{countryData.nativeName || 'Unknown'}</span>
                </p>
              </header>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="legend-block space-y-4">
                  <header className="flex items-center gap-2 border-b border-base-content/10 pb-2 mb-2">
                    <Navigation className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Spatial Coordinates</span>
                  </header>
                  <div className="space-y-4 text-sm font-bold">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase opacity-30">Population Mass</span>
                      <span>{countryData.population.toLocaleString()} Units</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase opacity-30">Global Sector</span>
                      <span>{countryData.region} / {countryData.subregion}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase opacity-30">Admin Hub</span>
                      <span>{countryData.capital?.join(", ") || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="legend-block space-y-4">
                  <header className="flex items-center gap-2 border-b border-base-content/10 pb-2 mb-2">
                    <Info className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">System Parameters</span>
                  </header>
                  <div className="space-y-4 text-sm font-bold">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase opacity-30">Communication Domain</span>
                      <span className="text-primary">{countryData.tld}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase opacity-30">Traffic Orientation</span>
                      <span className="flex items-center gap-2">
                        <Car className="w-3 h-3 opacity-50" />
                        Drive {countryData.carSide.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase opacity-30">Linguistic Framework</span>
                      <span className="truncate">{countryData.languages}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="legend-block space-y-4">
                <header className="flex items-center gap-2 border-b border-base-content/10 pb-2 mb-2">
                  <Coins className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Economic Indicator</span>
                </header>
                <div className="text-xl font-black tracking-tight">{countryData.currencies}</div>
              </div>

              <div className="flex flex-wrap gap-4">
                {countryData.maps && (
                  <a href={countryData.maps} target="_blank" rel="noreferrer" className="btn btn-primary btn-outline gap-2 px-8 flex-1">
                    <Map className="w-4 h-4" /> Open Interactive Map <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Borders */}
              <div className="pt-8 space-y-4">
                <header className="flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Adjacent Sectors</span>
                </header>
                {countryData.borders.length > 0 ? (
                  <div className="flex flex-wrap gap-2 text-[10px] font-black">
                    {countryData.borders.map((border) => (
                      <Link
                        key={border}
                        to={`/country/${border}`}
                        className="px-4 py-2 map-module hover:border-primary transition-colors uppercase tracking-widest"
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="opacity-30 italic text-xs">No Adjacent Sectors Recorded</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetails;