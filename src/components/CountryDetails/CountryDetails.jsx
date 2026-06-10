import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { countryApi } from "../../services/api";
import {
  ArrowLeft, Map, Globe, Users, Languages,
  Coins, Car, ExternalLink, Landmark,
  Navigation, LayoutGrid
} from 'lucide-react';

const StatRow = ({ label, value, icon: Icon }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 0' }}>
      {Icon && (
        <Icon
          style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.38)', marginTop: '2px', flexShrink: 0 }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <span className="label-11">{label}</span>
        <span
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#1C1C1E',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </span>
      </div>
    </div>
    <div className="sep" />
  </>
);

const GlassCard = ({ children, style = {} }) => (
  <div className="glass" style={{ padding: '24px', ...style }}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, label }) => (
  <div style={{ marginBottom: '4px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px' }}>
      {Icon && <Icon style={{ width: '13px', height: '13px', color: 'rgba(60,60,67,0.40)' }} />}
      <span className="label-xs">{label}</span>
    </div>
    <div className="sep-glass" />
  </div>
);

const CountryDetails = () => {
  const params = useParams();
  const countryName = params.countryName;
  const navigate = useNavigate();

  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const handleBackButton = () => navigate(-1);

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
        .map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`)
        .join(", "),
      currencySymbol: Object.values(data.currencies || {})[0]?.symbol || '',
      currencyName: Object.values(data.currencies || {})[0]?.name || '',
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
          borders: borderCountries.map(c => c.name.common),
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
        if (isMounted) processCountryData(data);
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        gap: '16px',
      }}
    >
      <Globe
        style={{
          width: '40px',
          height: '40px',
          color: 'rgba(60,60,67,0.25)',
          animation: 'spin 2s linear infinite',
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <span className="label-xs">Loading…</span>
    </div>
  );

  if (notFound) return (
    <div
      style={{
        textAlign: 'center',
        padding: '80px 20px',
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: '800', color: 'rgba(60,60,67,0.12)', margin: '0 0 32px' }}>
        Not Found
      </h1>
      <button
        onClick={() => navigate('/')}
        className="btn-accent-solid"
      >
        Return to Atlas
      </button>
    </div>
  );

  return (
    <div
      className="page-enter"
      style={{ minHeight: '100vh', paddingBottom: '80px' }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '48px',
          }}
        >
          <button
            className="btn-back glass glass-pill"
            onClick={handleBackButton}
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            Back
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '10px',
              fontWeight: '500',
              color: 'rgba(60,60,67,0.35)',
              letterSpacing: '0.04em',
            }}
          >
            <span>{countryData?.cca3}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '9px' }}>v3.1</span>
          </div>
        </div>

        {countryData && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)',
              gap: '40px',
              alignItems: 'start',
            }}
            className="details-grid"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={countryData.flag}
                    alt={`${countryData.name} flag`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '20px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '20px',
                      boxShadow: 'inset 0 0 32px rgba(0,0,0,0.12)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              </GlassCard>

              {countryData.coatOfArms && (
                <GlassCard style={{ textAlign: 'center' }}>
                  <SectionHeader icon={LayoutGrid} label="Coat of Arms" />
                  <div style={{ paddingTop: '20px' }}>
                    <img
                      src={countryData.coatOfArms}
                      alt={`${countryData.name} coat of arms`}
                      style={{
                        height: '120px',
                        width: 'auto',
                        margin: '0 auto',
                        display: 'block',
                        transition: 'transform 300ms ease-out',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                </GlassCard>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ paddingLeft: '4px' }}>
                <p
                  className="label-xs"
                  style={{ margin: '0 0 6px', letterSpacing: '0.06em' }}
                >
                  {countryData.nativeName || countryData.name}
                </p>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 'clamp(42px, 6vw, 64px)',
                    fontWeight: '700',
                    letterSpacing: '-1.5px',
                    color: '#0D0D0F',
                    lineHeight: 1.05,
                  }}
                >
                  {countryData.name}
                </h1>
              </div>

              <GlassCard>
                <SectionHeader icon={Navigation} label="Geography" />
                <div style={{ paddingTop: '4px' }}>
                  <StatRow icon={Users} label="Population" value={countryData.population.toLocaleString()} />
                  <StatRow icon={Globe} label="Region" value={`${countryData.region}${countryData.subregion ? ` · ${countryData.subregion}` : ''}`} />
                  <StatRow icon={Landmark} label="Capital" value={countryData.capital?.join(", ") || '—'} />
                </div>
              </GlassCard>

              <GlassCard>
                <SectionHeader icon={Navigation} label="Details" />
                <div style={{ paddingTop: '4px' }}>
                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.38)', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="label-11">Domain</span>
                      <span
                        style={{
                          fontFamily: 'ui-monospace, monospace',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1C1C1E',
                          background: 'rgba(255,255,255,0.40)',
                          border: '1px solid rgba(255,255,255,0.55)',
                          borderRadius: '6px',
                          padding: '1px 8px',
                          display: 'inline-block',
                        }}
                      >
                        {countryData.tld || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="sep" />

                  <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Car style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.38)', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className="label-11">Traffic side</span>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#1C1C1E' }}>
                        {countryData.carSide === 'left' ? '← Drive Left' : '→ Drive Right'}
                      </span>
                    </div>
                  </div>
                  <div className="sep" />

                  <StatRow icon={Languages} label="Languages" value={countryData.languages || '—'} />
                </div>
              </GlassCard>

              <GlassCard>
                <SectionHeader icon={Coins} label="Economy" />
                <div style={{ paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    {countryData.currencySymbol && (
                      <span
                        style={{
                          fontSize: '32px',
                          fontWeight: '300',
                          color: 'rgba(60,60,67,0.35)',
                          lineHeight: 1,
                        }}
                      >
                        {countryData.currencySymbol}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '22px',
                        fontWeight: '600',
                        color: '#1C1C1E',
                        letterSpacing: '-0.3px',
                      }}
                    >
                      {countryData.currencyName || countryData.currencies}
                    </span>
                  </div>
                  {countryData.currencySymbol && countryData.currencyName && (
                    <span className="label-xs" style={{ paddingLeft: '2px' }}>
                      {countryData.currencies}
                    </span>
                  )}
                </div>
              </GlassCard>

              {countryData.maps && (
                <a
                  href={countryData.maps}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent-solid"
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Map style={{ width: '15px', height: '15px' }} />
                  Open Interactive Map
                  <ExternalLink style={{ width: '12px', height: '12px', opacity: 0.7 }} />
                </a>
              )}

              <div style={{ paddingTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <LayoutGrid style={{ width: '13px', height: '13px', color: 'rgba(60,60,67,0.40)' }} />
                  <span className="label-xs">Neighboring Countries</span>
                </div>

                {countryData.borders.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {countryData.borders.map((border) => (
                      <Link
                        key={border}
                        to={`/country/${border}`}
                        className="neighbor-chip glass-pill"
                        style={{
                          textDecoration: 'none',
                          color: '#1C1C1E',
                          fontSize: '13px',
                          fontWeight: '500',
                          padding: '7px 16px',
                          display: 'inline-block',
                        }}
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(60,60,67,0.35)',
                      fontStyle: 'italic',
                      margin: 0,
                    }}
                  >
                    Island nation — no land borders
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .details-grid > div:first-child {
            order: 2;
          }
          .details-grid > div:last-child {
            order: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default CountryDetails;