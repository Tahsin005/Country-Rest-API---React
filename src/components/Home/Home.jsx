import { useState } from "react";
import CountryList from "../CountryList/CountryList";
import FilterBox from "../FilterBox/FilterBox";
import SearchBox from "../SearchBox/SearchBox";
import { LayoutGrid, ArrowDownAz, Compass } from 'lucide-react';

const Home = () => {
    const [search, setSearch] = useState('');
    const [region, setRegion] = useState('');
    const [sortBy, setSortBy] = useState('name');

    return (
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Navigator Header */}
            <div className="flex flex-col gap-8 mb-16">
                <div className="flex items-center gap-4">
                    <Compass className="w-6 h-6 text-primary animate-pulse" />
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Sector Navigator</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-primary/30" />
                            <span className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">Orbital Scanning Active</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 map-module relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-primary/5 rounded-tr-3xl" />
                    
                    <div className="flex-1 max-w-xl">
                        <SearchBox setSearch={setSearch} />
                    </div>
                    
                    <div className="flex flex-wrap gap-6 items-center">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-1">
                                <ArrowDownAz className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Filter Sequence</span>
                            </div>
                            <select 
                                className="select select-sm glass-effect border-base-content/10 focus:border-primary/50 text-[10px] font-black uppercase tracking-widest h-11"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Alpha Sort</option>
                                <option value="population">Mass / Population</option>
                                <option value="area">Surface Area</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-1">
                                <LayoutGrid className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Region Layer</span>
                            </div>
                            <FilterBox setRegion={setRegion} />
                        </div>
                    </div>
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