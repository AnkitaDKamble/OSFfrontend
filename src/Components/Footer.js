import React from 'react';
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  let location = useLocation();

  const handleScrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <>
      <div className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>A/P Titave Tal: Radhanagari, District: Kolhapur.</p>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>PIN:416208</p>
              <p className="mb-2"> <i className="fas fa-phone"></i> +91 9881278909</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>ankitakamblemay@gmail.com</p>

              <div className="d-flex pt-2">
                <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-twitter"></i></Link>
                <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-facebook-f"></i></Link>
                <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-youtube"></i></Link>
                <Link className="btn btn-outline-light btn-social" to=""><i className="fab fa-linkedin-in"></i></Link>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
             
            </div>
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light text-white fw-bold mb-4">Quick Links</h4>
              
              <Link 
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`} 
                to="/" 
                onClick={handleScrollToTop}
              >
                <strong>Home</strong>
              </Link><br />
              <Link 
                className={`nav-link ${location.pathname === "/order" ? "active" : ""}`} 
                to="/order" 
                onClick={handleScrollToTop}
              >
                <strong>Order</strong>
              </Link><br />
             <br />
              <Link 
                className={`nav-link ${location.pathname === "/contactus" ? "active" : ""}`} 
                to="/contactus" 
                onClick={handleScrollToTop}
              >
                Contact Us
              </Link><br />
              <Link 
                className={`nav-link ${location.pathname === "/aboutus" ? "active" : ""}`} 
                to="/aboutus" 
                onClick={handleScrollToTop}
              >
                About Us
              </Link><br />
              <Link 
                className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`} 
                to="/signup" 
                onClick={handleScrollToTop}
              >
                Sign Up
              </Link><br />
              <Link 
                className={`nav-link ${location.pathname === "/login" ? "active" : ""}`} 
                to="/login" 
                onClick={handleScrollToTop}
              >
                Log in
              </Link><br />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                © <Link className="border-bottom text-white" to="#">Omkar Steel Fabrication</Link>, All Right Reserved.
              </div>
              <div className="col-md-6 text-center text-md-end">
                Website Designed By <Link className="border-bottom text-white" to="/" >Ankita D. Kamble</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
