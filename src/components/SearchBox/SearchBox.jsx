import PropTypes from 'prop-types'
import { Search } from 'lucide-react';

const SearchBox = ({ setSearch }) => {
    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <input 
                onChange={(e) => setSearch(e.target.value)} 
                type="text" 
                placeholder="SCAN SECTOR / COUNTRY NAME..." 
                className="input w-full pl-12 glass-effect border-base-content/10 focus:border-primary/50 text-xs font-black tracking-widest uppercase placeholder:opacity-30 h-14" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black opacity-20 tracking-tighter uppercase whitespace-nowrap hidden sm:block">
                Sector Searcher v1.0
            </div>
        </div>
    );
};

SearchBox.propTypes = {
    setSearch: PropTypes.func.isRequired,
}

export default SearchBox;