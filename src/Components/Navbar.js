import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  let location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [role, setRole] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logout successful');
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('customerName');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        
        localStorage.setItem('showLogoutPopup', 'true');
        
        setIsLoggedIn(false);
        setRole('');
        setCustomerName('');
        
        navigate('/');
      } else {
        console.error('Logout failed:', await response.json());
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('customerName');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('customerName');
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate]);

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
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCustomerName(response.data.username);
          localStorage.setItem('customerName', response.data.username);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          setIsLoggedIn(false);
        }
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-black-theme sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand brand-logo" to='/' onClick={handleScrollToTop}>
            <i className="bi bi-building me-2"></i>
            <span>Omkar Steel<span className="brand-highlight"> Fabricators</span></span>
          </Link>
          <button
            className="navbar-toggler theme-toggler"
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
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link 
                  className={`nav-link theme-nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                  to="/" 
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-house-door me-1"></i> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link theme-nav-link ${location.pathname === '/Service' ? 'active' : ''}`} 
                  to="/Service" 
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-tools me-1"></i> Services
                </Link>
              </li>

              {isLoggedIn && role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/OrderDashboard' ? 'active' : ''}`} 
                      to="/OrderDashboard"  
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-clipboard-data me-1"></i> Orders Dash
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/OrderHistoryDashboard' ? 'active' : ''}`} 
                      to="/OrderHistoryDashboard"  
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-clock-history me-1"></i> Orders History
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/ServiceDashboard' ? 'active' : ''}`} 
                      to="/ServiceDashboard" 
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-gear me-1"></i> Services Dash
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/Profile' ? 'active' : ''}`} 
                      to="/Profile" 
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-person-circle me-1"></i> Profile
                    </Link>
                  </li>
                </>
              )}

              {isLoggedIn && role === 'user' && (
                <>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/MyOrder' ? 'active' : ''}`} 
                      to="/MyOrder" 
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-cart me-1"></i> My Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/OrderHistory' ? 'active' : ''}`} 
                      to="/OrderHistory" 
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-clock-history me-1"></i> Order History
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link theme-nav-link ${location.pathname === '/Profile' ? 'active' : ''}`} 
                      to="/Profile" 
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-person-circle me-1"></i> Profile
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <Link 
                  className={`nav-link theme-nav-link ${location.pathname === '/Aboutus' ? 'active' : ''}`} 
                  to="/Aboutus" 
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-info-circle me-1"></i> About Us
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link theme-nav-link ${location.pathname === '/Contactus' ? 'active' : ''}`} 
                  to="/Contactus" 
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-envelope me-1"></i> Contact Us
                </Link>
              </li>
            </ul>

            <div className="auth-buttons">
              {isLoggedIn ? (
                <>
                  <div className="user-greeting-card">
                    <i className="bi bi-person-circle user-icon"></i>
                    <span className="user-name">{customerName}</span>
                  </div>
                  <button
                    className="btn-logout"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-right me-1"></i> Logout
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="auth-buttons-group">
                  <button
                    className="btn-signup"
                    onClick={() => navigate('/signup')}
                  >
                    <i className="bi bi-person-plus me-1"></i> Sign Up
                  </button>
                  <button
                    className="btn-login"
                    onClick={() => navigate('/login')}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;