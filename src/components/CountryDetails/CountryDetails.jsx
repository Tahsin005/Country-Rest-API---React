import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { countryApi } from "../../services/api";
import ShimmerDetails from "../ShimmerDetails/ShimmerDetails";
import {
  ArrowLeft, Map, Users, Languages,
  Coins, Car, ExternalLink, Landmark,
  Navigation, LayoutGrid, Globe
} from 'lucide-react';

const StatRow = ({ label, value, icon: Icon }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 0' }}>
      {Icon && (
        <Icon
          style={{ width: '16px', height: '16px', color: 'rgba(60,60,67,0.38)', marginTop: '2px', flexShrink: 0 }}
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        <span className="label-11">{label}</span>
        <span
          style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#1C1C1E',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </span>
      </div>
    </div>
  </>
);

const GlassCard = ({ children, style = {} }) => (
  <div className="glass glass-lg" style={{ padding: '32px', ...style }}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, label }) => (
  <div style={{ marginBottom: '4px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px' }}>
      {Icon && <Icon style={{ width: '15px', height: '15px', color: 'rgba(60,60,67,0.40)' }} />}
      <span className="label-xs" style={{ fontSize: '11px' }}>{label}</span>
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
      name: data.names?.common,
      nativeName: data.names?.native ? Object.values(data.names.native)[0]?.common : undefined,
      population: data.population,
      area: data.area?.kilometers,
      region: data.region,
      subregion: data.subregion,
      capital: data.capitals?.map(c => c.name),
      flag: data.flag?.url_svg,
      tld: data.tlds?.[0],
      languages: data.languages?.map(l => l.name).join(", "),
      currencies: data.currencies?.map(c => `${c.name}${c.symbol ? ` (${c.symbol})` : ''}`).join(", "),
      currencySymbol: data.currencies?.[0]?.symbol || '',
      currencyName: data.currencies?.[0]?.name || '',
      borders: [],
      maps: data.links?.google_maps,
      carSide: data.cars?.driving_side,
      cca3: data.codes?.alpha_3,
    };

    setCountryData(processed);
    setLoading(false);

    if (data.borders && data.borders.length > 0) {
      try {
        const borderCountries = await countryApi.getByCodes(data.borders);
        setCountryData(prev => ({
          ...prev,
          borders: borderCountries.map(c => c.names?.common || c.codes?.alpha_3),
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

  if (loading) return <ShimmerDetails />;

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
      {countryData && (
        <div style={{ position: 'relative', width: '100%', minHeight: '400px', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-50px',
              backgroundImage: `url(${countryData.flag})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(50px) saturate(180%) brightness(1.2)',
              opacity: 0.35,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(245, 240, 232, 0.1) 0%, rgba(245, 240, 232, 1) 100%)',
              zIndex: 1,
            }}
          />

          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '40px 48px',
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Nav Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '60px'
              }}
            >
              <button
                className="btn-back glass glass-pill"
                onClick={handleBackButton}
                style={{ padding: '8px 24px' }}
              >
                <ArrowLeft style={{ width: '15px', height: '15px' }} />
                Back
              </button>

              <div
                className="glass-pill"
                style={{
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'rgba(60,60,67,0.5)',
                  letterSpacing: '0.04em',
                }}
              >
                <span>{countryData?.cca3}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '10px' }}>v5</span>
              </div>
            </div>

            <div className="hero-content" style={{ display: 'flex', alignItems: 'flex-end', gap: '48px', flexWrap: 'wrap' }}>
              <div
                className="glass"
                style={{
                  padding: '12px',
                  borderRadius: '24px',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
                  flexShrink: 0,
                }}
              >
                <img
                  src={countryData?.flag || "https://placehold.co/600x400"}
                  alt={`${countryData.name} flag`}
                  style={{
                    width: '220px',
                    height: '140px',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    display: 'block',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
              </div>

              <div style={{ paddingBottom: '10px' }}>
                <p
                  className="label-xs"
                  style={{ margin: '0 0 10px', letterSpacing: '0.08em', fontSize: '13px' }}
                >
                  {countryData.nativeName || countryData.name}
                </p>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 'clamp(48px, 8vw, 84px)',
                    fontWeight: '800',
                    letterSpacing: '-2px',
                    color: '#0D0D0F',
                    lineHeight: 1.05,
                  }}
                >
                  {countryData.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {countryData && (
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 48px',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 28px', flex: '1 1 auto' }}>
              <Users style={{ width: '18px', height: '18px', color: 'rgba(60,60,67,0.4)' }} />
              <div>
                <div className="label-xs" style={{ marginBottom: '4px' }}>Population</div>
                <div style={{ fontSize: '17px', fontWeight: '600' }}>{countryData.population.toLocaleString()}</div>
              </div>
            </div>

            <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 28px', flex: '1 1 auto' }}>
              <Map style={{ width: '18px', height: '18px', color: 'rgba(60,60,67,0.4)' }} />
              <div>
                <div className="label-xs" style={{ marginBottom: '4px' }}>Area</div>
                <div style={{ fontSize: '17px', fontWeight: '600' }}>{countryData.area ? `${countryData.area.toLocaleString()} km²` : '—'}</div>
              </div>
            </div>

            <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 28px', flex: '1 1 auto' }}>
              <Landmark style={{ width: '18px', height: '18px', color: 'rgba(60,60,67,0.4)' }} />
              <div>
                <div className="label-xs" style={{ marginBottom: '4px' }}>Capital</div>
                <div style={{ fontSize: '17px', fontWeight: '600' }}>{countryData.capital?.join(", ") || '—'}</div>
              </div>
            </div>

            <div className="glass-pill" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 28px', flex: '1 1 auto' }}>
              <Globe style={{ width: '18px', height: '18px', color: 'rgba(60,60,67,0.4)' }} />
              <div>
                <div className="label-xs" style={{ marginBottom: '4px' }}>Region</div>
                <div style={{ fontSize: '17px', fontWeight: '600' }}>{`${countryData.region}${countryData.subregion ? ` · ${countryData.subregion}` : ''}`}</div>
              </div>
            </div>
          </div>

          <div
            className="details-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '32px',
            }}
          >
            <GlassCard style={{ gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}>
              <SectionHeader icon={Coins} label="Economy" />
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                  {countryData.currencySymbol && (
                    <span
                      style={{
                        fontSize: '64px',
                        fontWeight: '300',
                        color: 'rgba(60,60,67,0.25)',
                        lineHeight: 1,
                      }}
                    >
                      {countryData.currencySymbol}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: '40px',
                      fontWeight: '700',
                      color: '#1C1C1E',
                      letterSpacing: '-0.5px',
                      lineHeight: 1.1,
                    }}
                  >
                    {countryData.currencyName || countryData.currencies || '—'}
                  </span>
                </div>
                {countryData.currencySymbol && countryData.currencyName && (
                  <span className="label-xs" style={{ paddingLeft: '4px', fontSize: '13px' }}>
                    {countryData.currencies}
                  </span>
                )}
              </div>
            </GlassCard>

            <GlassCard>
              <SectionHeader icon={Navigation} label="General Info" />
              <div style={{ paddingTop: '12px' }}>
                <div style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Globe style={{ width: '16px', height: '16px', color: 'rgba(60,60,67,0.38)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="label-11">Internet Domain</span>
                    <span
                      style={{
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1C1C1E',
                        background: 'rgba(255,255,255,0.40)',
                        border: '1px solid rgba(255,255,255,0.55)',
                        borderRadius: '6px',
                        padding: '2px 10px',
                        display: 'inline-block',
                      }}
                    >
                      {countryData.tld || '—'}
                    </span>
                  </div>
                </div>
                <div className="sep" />

                <div style={{ padding: '14px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Car style={{ width: '16px', height: '16px', color: 'rgba(60,60,67,0.38)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="label-11">Traffic Side</span>
                    <span style={{ fontSize: '16px', fontWeight: '500', color: '#1C1C1E' }}>
                      {countryData.carSide === 'left' ? '← Drive Left' : '→ Drive Right'}
                    </span>
                  </div>
                </div>
                <div className="sep" />
                <StatRow icon={Languages} label="Languages" value={countryData.languages || '—'} />
              </div>
            </GlassCard>

            <GlassCard style={{ gridRow: 'span 2' }}>
              <SectionHeader icon={LayoutGrid} label="Neighboring Countries" />
              <div style={{ paddingTop: '20px' }}>
                {countryData.borders.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
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
                          fontSize: '14px',
                          fontWeight: '600',
                          padding: '10px 20px',
                          display: 'inline-block',
                        }}
                      >
                        {border}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '40px 0',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '15px',
                        color: 'rgba(60,60,67,0.4)',
                        fontStyle: 'italic',
                        margin: 0,
                      }}
                    >
                      Island nation — no land borders
                    </p>
                  </div>
                )}
              </div>

              {countryData.maps && (
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <a
                    href={countryData.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-accent-solid"
                    style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
                  >
                    <Map style={{ width: '16px', height: '16px' }} />
                    Open Interactive Map
                    <ExternalLink style={{ width: '14px', height: '14px', opacity: 0.7 }} />
                  </a>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-content {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 24px !important;
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