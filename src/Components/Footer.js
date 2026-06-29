import React from 'react';
import { Link, useLocation } from "react-router-dom";
import './Footer.css';

const Footer = () => {
  let location = useLocation();

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="container-fluid footer-business mt-5 pt-5">
        <div className="container py-5">
          <div className="row g-5">
            {/* Column 1: Company Info */}
            <div className="col-lg-4 col-md-6">
              <h4 className="footer-title mb-4">
                <i className="bi bi-building me-2"></i>Omkar Steel Fabricators
              </h4>

              <div className="contact-info-table">
                <div className="contact-row">
                  <div className="contact-icon">
                    <i className="bi bi-geo-alt-fill text-gold"></i>
                  </div>
                  <div className="contact-text">
                    A/P Titave Tal: Radhanagari, District: Kolhapur.
                  </div>
                </div>
                <div className="contact-row">
                  <div className="contact-icon">
                    <i className="bi bi-pin-map-fill text-gold"></i>
                  </div>
                  <div className="contact-text">
                    PIN: 416208
                  </div>
                </div>
                <div className="contact-row">
                  <div className="contact-icon">
                    <i className="bi bi-telephone-fill text-gold"></i>
                  </div>
                  <div className="contact-text">
                    +91 9881278909
                  </div>
                </div>
                <div className="contact-row">
                  <div className="contact-icon">
                    <i className="bi bi-envelope-fill text-gold"></i>
                  </div>
                  <div className="contact-text">
                    ankitakamblemay@gmail.com
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links with New Bullets */}
            <div className="col-lg-4 col-md-6">
              <h4 className="footer-title mb-4">
                <i className="bi bi-link-45deg me-2"></i>Quick Links
              </h4>
              <div className="quick-links">
                <Link
                  className={`footer-link ${location.pathname === "/" ? "active" : ""}`}
                  to="/"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-gem me-2"></i>  {/* Diamond bullet */}
                  Home
                </Link>
                <Link
                  className={`footer-link ${location.pathname === "/Service" ? "active" : ""}`}
                  to="/Service"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-gem me-2"></i>  {/* Diamond bullet */}
                  Services
                </Link>
                <Link
                  className={`footer-link ${location.pathname === "/aboutus" ? "active" : ""}`}
                  to="/aboutus"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-gem me-2"></i>  {/* Diamond bullet */}
                  About Us
                </Link>
                <Link
                  className={`footer-link ${location.pathname === "/contactus" ? "active" : ""}`}
                  to="/contactus"
                  onClick={handleScrollToTop}
                >
                  <i className="bi bi-gem me-2"></i>  {/* Diamond bullet */}
                  Contact Us
                </Link>
                {localStorage.getItem('isLoggedIn') === 'true' && (
                  <>
                    <Link
                      className={`footer-link ${location.pathname === "/MyOrder" ? "active" : ""}`}
                      to="/MyOrder"
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-gem me-2"></i>  {/* Diamond bullet */}
                      My Orders
                    </Link>
                    <Link
                      className={`footer-link ${location.pathname === "/Profile" ? "active" : ""}`}
                      to="/Profile"
                      onClick={handleScrollToTop}
                    >
                      <i className="bi bi-gem me-2"></i>  {/* Diamond bullet */}
                      My Profile
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Column 3: Business Hours & Follow Us */}
            <div className="col-lg-4 col-md-6">
              <h4 className="footer-title mb-4">
                <i className="bi bi-clock-history me-2"></i>Business Hours
              </h4>
              <div className="business-hours-card">
                <div className="business-hour-row">
                  <div className="hour-icon">
                    <i className="bi bi-calendar-week text-gold"></i>
                  </div>
                  <div className="hour-details">
                    <span className="day">Monday - Saturday</span>
                    <span className="time">9:00 AM - 7:00 PM</span>
                  </div>
                </div>
                <div className="business-hour-row">
                  <div className="hour-icon">
                    <i className="bi bi-calendar-day text-gold"></i>
                  </div>
                  <div className="hour-details">
                    <span className="day">Sunday</span>
                    <span className="time closed">Closed</span>
                  </div>
                </div>
              </div>

              <div className="follow-us-section mt-4">
                <h5 className="text-gold mb-3">
                  <i className="bi bi-share-fill me-2"></i>Follow Us
                </h5>
                <div className="social-links">
                  <Link className="social-icon" to="https://twitter.com" target="_blank">
                    <i className="bi bi-twitter"></i>
                  </Link>
                  <Link className="social-icon" to="https://facebook.com" target="_blank">
                    <i className="bi bi-facebook"></i>
                  </Link>
                  <Link className="social-icon" to="https://youtube.com" target="_blank">
                    <i className="bi bi-youtube"></i>
                  </Link>
                  <Link className="social-icon" to="https://instagram.com" target="_blank">
                    <i className="bi bi-instagram"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p className="mb-0">
                  © {new Date().getFullYear()} <Link className="copyright-link" to="#">Omkar Steel Fabricators</Link>,
                  All Rights Reserved.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <p className="mb-0">
                  Designed with <i className="bi bi-heart-fill text-danger mx-1"></i> by
                  <Link className="copyright-link ms-1" to="/">Ankita D. Kamble</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;