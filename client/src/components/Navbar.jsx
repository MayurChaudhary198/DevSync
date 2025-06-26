import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo2.jpeg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 py-3 flex items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="DevSync"
            className="h-8 w-8 rounded object-contain"
          />
          <span className="text-blue-600 font-bold text-lg">DevSync</span>
        </Link>

        {/* Right side desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/developer"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Developer
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 hover:underline transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pb-4 pt-2">
          {isAuthenticated && (
            <>
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-gray-700 hover:text-blue-600"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="block w-full text-left text-sm text-red-600 py-2"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-white bg-blue-600 px-3 py-1 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
