import PropTypes from 'prop-types';
import { Search } from 'lucide-react';

const SearchBox = ({ setSearch }) => {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-4 flex items-center pointer-events-none text-muted-foreground z-10">
        <Search className="w-4 h-4 text-primary" />
      </div>

      <input
        type="text"
        className="glass-input pr-4 py-3 text-sm font-display rounded-xl w-full text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary/40 focus:border-primary/50"
        style={{ paddingLeft: '44px' }}
        placeholder="Scan country database by name…"
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search countries"
      />
    </div>
  );
};

SearchBox.propTypes = {
  setSearch: PropTypes.func.isRequired,
};

export default SearchBox;