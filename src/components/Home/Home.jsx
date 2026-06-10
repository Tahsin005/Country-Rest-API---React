import { useState } from "react";
import CountryList from "../CountryList/CountryList";
import FilterBox from "../FilterBox/FilterBox";
import SearchBox from "../SearchBox/SearchBox";
import { ArrowDownAz, Map } from 'lucide-react';

const Home = () => {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState('name');

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
          <div className="select-wrapper">
            <select
              className="glass-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort countries"
            >
              <option value="name">Name (A–Z)</option>
              <option value="population">Population</option>
              <option value="area">Area</option>
            </select>
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
        sortBy={sortBy}
      />
    </div>
  );
};

export default Home;