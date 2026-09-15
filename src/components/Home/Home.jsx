import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CountryList from "../CountryList/CountryList";
import FilterBox from "../FilterBox/FilterBox";
import SearchBox from "../SearchBox/SearchBox";
import { ArrowDownAz, ChevronDown, Heart, Sparkles } from 'lucide-react';
import { favoritesStorage } from "../../services/favoritesStorage";

const sortOptions = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'population', label: 'Population' },
  { value: 'area', label: 'Area' },
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(favoritesStorage.getFavorites().length);
  const sortRef = useRef(null);

  // Directly derive showSavedOnly from URL query param to stay in sync with navigation
  const showSavedOnly = searchParams.get('favorites') === 'true';

  useEffect(() => {
    const unsubscribe = favoritesStorage.subscribe((favs) => {
      setSavedCount(favs.length);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSavedOnly = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (showSavedOnly) {
        next.delete('favorites');
      } else {
        next.set('favorites', 'true');
      }
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="section-label text-[10px]">Planetary Registry · Live Intelligence</span>
        </div>

        <h1 className="font-display text-[clamp(44px,8vw,88px)] font-bold tracking-tighter mb-4 leading-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50">
            World{" "}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-2 to-accent-3">
            Atlas
          </span>
        </h1>

        <p className="font-body text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Real-time cartographic intelligence powered by live meteorology, foreign exchange, encyclopedic culture, and interactive coordinates.
        </p>
      </div>

      <div
        className="glass-panel p-5 md:p-6 mb-12 flex flex-wrap gap-4 items-end shadow-2xl relative z-10"
        style={{
          background: 'rgba(20, 16, 38, 0.7)',
          backdropFilter: 'blur(40px)',
        }}
      >
        <div className="flex-[1_1_280px] min-w-[240px]">
          <span className="section-label block mb-2 text-primary">Scan Registry</span>
          <SearchBox setSearch={setSearch} />
        </div>

        <div className="flex flex-col">
          <span className="section-label block mb-2">Order By</span>
          <div className="relative min-w-[170px]" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="glass-input flex items-center justify-between px-4 py-3 cursor-pointer rounded-xl font-display font-medium text-sm text-foreground hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowDownAz className="w-3.5 h-3.5 text-accent-3" />
                <span>{sortBy.label}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isSortOpen && (
              <div
                className="glass-panel absolute top-[calc(100%+8px)] left-0 right-0 p-2 z-50 flex flex-col gap-1 shadow-2xl border border-white/10"
                style={{
                  background: 'rgba(22, 18, 42, 0.95)',
                  backdropFilter: 'blur(40px)',
                }}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSortBy(opt);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left rounded-lg font-display text-xs font-semibold transition-all ${
                      sortBy.value === opt.value
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <span className="section-label block mb-2">Region Filter</span>
          <FilterBox setRegion={setRegion} currentRegion={region} />
        </div>

        <div className="flex flex-col">
          <span className="section-label block mb-2 text-rose-400">Bookmarks</span>
          <button
            type="button"
            onClick={toggleSavedOnly}
            className={`px-4 py-3 rounded-xl border font-display text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${
              showSavedOnly
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 ${showSavedOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Saved {savedCount > 0 ? `(${savedCount})` : ''}</span>
          </button>
        </div>
      </div>

      <CountryList
        search={search}
        region={region}
        sortBy={sortBy.value}
        showSavedOnly={showSavedOnly}
      />
    </div>
  );
};

export default Home;