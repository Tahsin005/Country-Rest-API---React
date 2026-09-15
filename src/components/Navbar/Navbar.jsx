import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe, Scale, Compass, Heart } from 'lucide-react';
import { favoritesStorage } from "../../services/favoritesStorage";

const Navbar = () => {
  const location = useLocation();
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setFavoriteCount(favoritesStorage.getFavorites().length);
    const unsubscribe = favoritesStorage.subscribe((favs) => {
      setFavoriteCount(favs.length);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { path: '/', label: 'Atlas', icon: Globe },
    { path: '/compare', label: 'Compare', icon: Scale },
    { path: '/quiz', label: 'Quest', icon: Compass },
  ];

  return (
    <div className="sticky top-3 sm:top-6 z-50 flex justify-center px-2 sm:px-4 pointer-events-none w-full">
      <nav
        className="glass-panel pointer-events-auto px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2.5 shadow-2xl border border-white/10 max-w-[96vw] overflow-x-auto no-scrollbar"
        style={{
          background: 'rgba(20, 16, 38, 0.75)',
          backdropFilter: 'blur(30px)',
        }}
      >

        <Link
          to="/"
          className="flex items-center gap-2 pr-1 sm:pr-2 pl-0.5 sm:pl-1 group text-decoration-none flex-shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300 flex-shrink-0">
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <span className="font-display font-bold text-sm sm:text-base tracking-tight text-foreground hidden sm:inline">
            World<span className="text-primary font-semibold">Atlas</span>
          </span>
        </Link>


        <div className="w-px h-4 sm:h-5 bg-white/10 mx-0.5 flex-shrink-0" />


        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full font-display text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all duration-300 flex-shrink-0 ${isActive
                    ? 'bg-primary text-white shadow-[0_0_20px_hsl(272_80%_55%/0.4)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>


        {favoriteCount > 0 && (
          <>
            <div className="w-px h-4 sm:h-5 bg-white/10 mx-0.5 flex-shrink-0" />
            <Link
              to="/?favorites=true"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 text-[11px] sm:text-xs font-display font-semibold transition-all flex-shrink-0"
              title="View saved countries"
            >
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500 flex-shrink-0" />
              <span className="font-mono">{favoriteCount}</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
