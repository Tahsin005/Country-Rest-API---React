import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-8 md:px-16 lg:px-24 pb-5 sticky top-0 z-10 bg-base-100">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
          </div>
          <Link to="/" className="sm:text-lg md:text-xl font-bold">Around the flags🌎</Link>
        </div>
        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end text-2xl">
          🏴
        </div>
      </div>
    </div>
  );
};

export default Navbar;
