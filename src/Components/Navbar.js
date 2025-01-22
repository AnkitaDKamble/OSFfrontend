import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [role, setRole] = useState('');

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
        <Link className="navbar-brand" to='/Hello'>Omkar Steel Fabricators</Link>
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
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Service">Services</Link>
            </li>

            {/* Admin-specific links */}
            {isLoggedIn && role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/OrderDashboard">Orders Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ServiceDashboard">Services Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile">Profile</Link>
                </li>
              </>
            )}

            {/* User-specific links */}
            {isLoggedIn && role === 'user' && (
            
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/MyOrder">My Orders</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/Profile">Profile</Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className="nav-link" to="/Aboutus">About Us</Link>
            </li>

            {/* Contact Us for all users */}
            
            {role !== 'user' && role !== 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/Contactus">Contact Us</Link>
              </li>
            )}
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