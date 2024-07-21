import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-8 md:px-16 lg:px-24 py-5">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
          </div>
          <Link to="/" className="text-xl font-bold">Around the flags</Link>
        </div>
        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end">
          🏴
        </div>
      </div>
    </div>
  );
};

export default Navbar;
