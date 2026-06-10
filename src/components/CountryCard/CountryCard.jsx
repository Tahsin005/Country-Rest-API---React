import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Users, Globe2, Landmark } from 'lucide-react';

const CountryCard = ({ country }) => {
  return (
    <Link
      to={`/country/${country.name.common}`}
      className="card-animate glass glass-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '170px',
          overflow: 'hidden',
          borderRadius: '16px 16px 0 0',
          flexShrink: 0,
        }}
      >
        <img
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 700ms ease-out',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.18) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
          }}
        >
          <span className="sector-badge">{country.cca3}</span>
        </div>
      </div>

      <div
        style={{
          padding: '18px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          flexGrow: 1,
        }}
      >
        <h3 className="country-name" style={{ margin: 0, lineHeight: 1.2 }}>
          {country.name.common}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
            }}
          >
            <Users style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.40)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
              <span className="label-xs">Population</span>
              <span className="value-md">{country.population.toLocaleString()}</span>
            </div>
          </div>
          <div className="sep" />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
            }}
          >
            <Globe2 style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.40)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
              <span className="label-xs">Region</span>
              <span className="value-md">{country.region}</span>
            </div>
          </div>
          <div className="sep" />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 0',
            }}
          >
            <Landmark style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.40)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: 0 }}>
              <span className="label-xs">Capital</span>
              <span
                className="value-md"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {country.capital?.[0] || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

CountryCard.propTypes = {
  country: PropTypes.object.isRequired,
};

export default CountryCard;
