import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Users, Navigation, Landmark, ChevronRight } from 'lucide-react';

const CountryCard = ({ country }) => {
  return (
    <Link 
      to={`/country/${country.name.common}`} 
      className="group flex flex-col map-module transition-all duration-500 hover:-translate-y-2 hover:border-primary/50"
    >
      <div className='relative h-[180px] overflow-hidden'>
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={country.flags.svg} 
          alt={`${country.name.common} flag`} 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="bg-primary px-2 py-0.5 rounded text-[10px] font-black text-primary-content uppercase tracking-tighter shadow-lg">
            Sector {country.cca3}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Abstract Coordinate Lines */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-primary/10 rounded-tr-3xl group-hover:border-primary/30 transition-colors" />
        
        <h3 className="text-xl font-black mb-6 truncate uppercase tracking-tighter group-hover:text-primary transition-colors">
          {country.name.common}
        </h3>
        
        <div className="space-y-4 text-xs font-bold flex-grow">
          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <Users className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest opacity-50">Population Data</span>
              <span>{country.population.toLocaleString()} Units</span>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <Navigation className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest opacity-50">Regional Sector</span>
              <span>{country.region}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
            <Landmark className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-widest opacity-50">Administrative Hub</span>
              <span className="truncate max-w-[140px]">{country.capital?.[0] || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-base-content/5 flex items-center justify-between text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Registry</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

CountryCard.propTypes = {
    country: PropTypes.object.isRequired
}

export default CountryCard;


