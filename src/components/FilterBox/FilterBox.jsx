import PropTypes from 'prop-types';

const FilterBox = ({ setRegion }) => {
  return (
    <div className="select-wrapper">
      <select
        className="glass-select"
        onChange={(e) => setRegion(e.target.value)}
        aria-label="Filter by region"
        defaultValue=""
      >
        <option value="">All Regions</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>
    </div>
  );
};

FilterBox.propTypes = {
  setRegion: PropTypes.func.isRequired,
};

export default FilterBox;
