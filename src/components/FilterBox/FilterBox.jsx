import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Oceania', label: 'Oceania' }
];

const FilterBox = ({ setRegion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (region) => {
    setSelectedRegion(region);
    setRegion(region.value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={dropdownRef} style={{ position: 'relative', minWidth: '180px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-select"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          border: '1px solid rgba(255,255,255,0.6)',
          background: isOpen ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin style={{ width: '14px', height: '14px', color: 'rgba(60,60,67,0.5)' }} />
          <span>{selectedRegion.label}</span>
        </div>
        <ChevronDown 
          style={{ 
            width: '14px', 
            height: '14px', 
            color: 'rgba(60,60,67,0.5)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease'
          }} 
        />
      </button>

      {isOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            padding: '8px',
            borderRadius: '16px',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            animation: 'card-enter 200ms ease-out forwards',
          }}
        >
          {regions.map((region) => (
            <button
              key={region.value}
              onClick={() => handleSelect(region)}
              style={{
                width: '100%',
                padding: '10px 12px',
                textAlign: 'left',
                background: selectedRegion.value === region.value ? 'rgba(255,255,255,0.4)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: selectedRegion.value === region.value ? '600' : '500',
                color: '#1C1C1E',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (selectedRegion.value !== region.value) e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                if (selectedRegion.value !== region.value) e.currentTarget.style.background = 'transparent';
              }}
            >
              {region.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

FilterBox.propTypes = {
  setRegion: PropTypes.func.isRequired,
};

export default FilterBox;
