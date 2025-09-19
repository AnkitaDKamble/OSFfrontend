import React, { useEffect, useState } from 'react';
import { Link, useLocation,useNavigate } from "react-router-dom";
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [role, setRole] = useState('');

  
  
  const handleScrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };
  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const name = localStorage.getItem('customerName') || '';
      const userRole = localStorage.getItem('role') || '';
      const token = localStorage.getItem('token');

      setIsLoggedIn(loggedIn);
      setCustomerName(name);
      setRole(userRole);

      if (loggedIn && token && !name) {
        try {
          // Fetch user details if name is not in localStorage
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCustomerName(response.data.username); // Assuming 'username' is returned
          localStorage.setItem('customerName', response.data.username); // Store username in localStorage
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle error, e.g., log out the user if token is invalid
          handleLogout();
        }
      }
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);



  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('customerName');
    localStorage.removeItem('role');
    localStorage.removeItem('token'); // Remove token when logging out
    setIsLoggedIn(false);
    setRole('');
    setCustomerName('');
    navigate('/'); // Redirect to home page on logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to='/Hello' onClick={handleScrollToTop}>Omkar Steel Fabricators</Link>
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
              <Link className="nav-link" to="/" onClick={handleScrollToTop}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Service" onClick={handleScrollToTop}>Services</Link>
            </li>

            {/* Admin-specific links */}
            {isLoggedIn && role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/OrderDashboard"  onClick={handleScrollToTop}>Orders Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/OrderHistoryDashboard"  onClick={handleScrollToTop}>Orders History Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ServiceDashboard" onClick={handleScrollToTop}>Services Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile" onClick={handleScrollToTop}>Profile</Link>
                </li>
              </>
            )}

            {/* User-specific links */}
            {isLoggedIn && role === 'user' && (

              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/MyOrder" onClick={handleScrollToTop}>My Orders</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/OrderHistory" onClick={handleScrollToTop}>Orders History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile" onClick={handleScrollToTop}>Profile</Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/Aboutus" onClick={handleScrollToTop}>About Us</Link>
            </li>

            {/* Contact Us for all users */}

            
              <li className="nav-item">
                <Link className="nav-link" to="/Contactus" onClick={handleScrollToTop}>Contact Us</Link>
              </li>
           
          </ul>
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <span className="text-light me-3">Hi, {customerName}</span>
                <button
                  className="btn btn-outline-warning me-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;