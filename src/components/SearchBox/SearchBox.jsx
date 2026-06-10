import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

const SearchBox = ({ setSearch }) => {
  return (
    <div
      className="glass-inset"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '14px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Search style={{ width: '16px', height: '16px', color: 'rgba(60,60,67,0.38)' }} />
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search countries…"
        onChange={(e) => setSearch(e.target.value)}
        style={{ borderRadius: '14px' }}
        aria-label="Search countries"
      />
    </div>
  );
};

SearchBox.propTypes = {
  setSearch: PropTypes.func.isRequired,
};

export default SearchBox;