import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Oceania', label: 'Oceania' },
];

const FilterBox = ({ setRegion, currentRegion = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedRegion = regions.find((r) => r.value === currentRegion) || regions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (reg) => {
    setRegion(reg.value);
    setIsOpen(false);
  };

  return (
    <div className="relative min-w-[180px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-input flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl font-display font-medium text-sm text-foreground hover:border-white/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-accent-2" />
          <span>{selectedRegion.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="glass-panel absolute top-[calc(100%+8px)] left-0 right-0 p-2 z-50 flex flex-col gap-1 shadow-2xl border border-white/10"
          style={{
            background: 'rgba(22, 18, 42, 0.95)',
            backdropFilter: 'blur(40px)',
          }}
        >
          {regions.map((reg) => (
            <button
              key={reg.value}
              type="button"
              onClick={() => handleSelect(reg)}
              className={`w-full px-3 py-2 text-left rounded-lg font-display text-xs font-semibold transition-all ${
                selectedRegion.value === reg.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

FilterBox.propTypes = {
  setRegion: PropTypes.func.isRequired,
  currentRegion: PropTypes.string,
};

export default FilterBox;
