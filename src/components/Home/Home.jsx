import { useState, useRef, useEffect } from "react";
import CountryList from "../CountryList/CountryList";
import FilterBox from "../FilterBox/FilterBox";
import SearchBox from "../SearchBox/SearchBox";
import { ArrowDownAz, Map, ChevronDown } from 'lucide-react';

const sortOptions = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'population', label: 'Population' },
  { value: 'area', label: 'Area' }
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="page-enter"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 48px 80px',
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Map style={{ width: '18px', height: '18px', color: 'rgba(60,60,67,0.45)' }} />
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              color: '#1C1C1E',
            }}
          >
            World Atlas
          </h1>
        </div>
        <p className="label-xs" style={{ paddingLeft: '28px', margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div
        className="glass glass-lg"
        style={{
          padding: '24px 28px',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end',
          overflow: 'visible',
          zIndex: 10,
        }}
      >
        <div style={{ flex: '1 1 260px', minWidth: '220px' }}>
          <span className="label-xs" style={{ display: 'block', marginBottom: '8px', paddingLeft: '2px' }}>
            Search
          </span>
          <SearchBox setSearch={setSearch} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowDownAz style={{ width: '12px', height: '12px', color: 'rgba(60,60,67,0.38)' }} />
            <span className="label-xs">Sort by</span>
          </div>
          <div className="custom-select-wrapper" ref={sortRef} style={{ position: 'relative', minWidth: '180px' }}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="glass-select"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                border: '1px solid rgba(255,255,255,0.6)',
                background: isSortOpen ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.35)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#1C1C1E' }}>{sortBy.label}</span>
              <ChevronDown 
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  color: 'rgba(60,60,67,0.5)',
                  transform: isSortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease'
                }} 
              />
            </button>

            {isSortOpen && (
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
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      textAlign: 'left',
                      background: sortBy.value === opt.value ? 'rgba(255,255,255,0.4)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '13px',
                      fontWeight: sortBy.value === opt.value ? '600' : '500',
                      color: '#1C1C1E',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy.value !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy.value !== opt.value) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="label-xs">Region</span>
          <FilterBox setRegion={setRegion} />
        </div>
      </div>

      <CountryList
        search={search}
        region={region}
        sortBy={sortBy.value}
      />
    </div>
  );
};

export default Home;