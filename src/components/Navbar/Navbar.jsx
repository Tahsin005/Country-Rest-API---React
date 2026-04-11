import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Globe, Compass } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="nav-console shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link 
          to="/" 
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="relative">
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-primary group-hover:rotate-[30deg] transition-transform duration-700" />
            <Compass className="w-4 h-4 md:w-5 md:h-5 text-secondary absolute -bottom-1 -right-1 group-hover:rotate-[120deg] transition-transform duration-1000" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
              World<span className="text-primary tracking-normal">Explorer</span>
            </span>
            <span className="text-[10px] font-bold opacity-30 tracking-[0.2em] uppercase">Cartographic Systems</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


