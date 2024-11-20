import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update `isLoggedIn` state whenever `localStorage` changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus); // Listen for changes in localStorage

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false'); // Clear login state
    setIsLoggedIn(false); // Update state
    navigate('/'); // Redirect to home
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Omkar Steel Fabricators</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/order' ? 'active' : ''}`} to="/order">Order</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/careers' ? 'active' : ''}`} to="/careers">Careers</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/contactus' ? 'active' : ''}`} to="/contactus">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/aboutus' ? 'active' : ''}`} to="/aboutus">About Us</Link>
            </li>
          </ul>
          <div className="d-flex">
            {!isLoggedIn ? (
              <>
                <button
                  className="btn btn-outline-warning me-2"
                  onClick={() => navigate('/signup')}
                >
                  Signup
                </button>
                <button
                  className="btn btn-outline-warning me-2"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </>
            ) : (
              <button
                className="btn btn-outline-warning me-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
