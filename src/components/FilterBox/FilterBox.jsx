import PropTypes from 'prop-types'
import { Layers } from 'lucide-react';

const FilterBox = ({ setRegion }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Layers className="w-4 h-4 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
      </div>
      <select 
        className="select pl-12 glass-effect border-base-content/10 focus:border-primary/50 text-xs font-black tracking-widest uppercase w-full md:w-[200px]" 
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">Global Regions</option>
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
