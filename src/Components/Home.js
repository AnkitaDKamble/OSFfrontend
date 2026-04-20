// src/Components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Home.css';
import Service from './Service';

const Home = () => {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate('/Service');
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {/* Hero Section */}
      <header className="hero-section text-white text-center py-5">
        <div className="hero-overlay"></div>
        <div className="container position-relative">
          <h6 className="text-gold mb-3 animate-text">Welcome to</h6>
          <h1 className="display-3 fw-bold mb-3 gradient-text-business">Omkar Steel Fabricators</h1>
          <h4 className="mb-4 text-light-white"><b>Your Vision, Our Expertise !!!</b></h4>
          <button 
            className="btn btn-business btn-lg px-5 py-3 rounded-pill shadow-lg hero-btn"
            onClick={handleOrderNow}
          >
            Order Now
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-5 features-section-business">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="business-title">Why Choose Us?</h2>
            <div className="underline-business mx-auto"></div>
            <p className="text-muted mt-3">Delivering excellence with trust and quality</p>
          </div>
          <div className="row g-4">
            {/* Your feature cards here */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-lg business-card">
                <div className="card-body text-center p-4">
                  <div className="icon-circle-business bg-business-gold mb-3 mx-auto">
                    <i className="bi bi-person-check fs-1 text-white"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Personalized Solutions for You</h5>
                  <p className="card-text text-muted">
                    We prioritize your unique needs, delivering customized solutions that align with your vision and budget.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-lg business-card">
                <div className="card-body text-center p-4">
                  <div className="icon-circle-business bg-business-gold mb-3 mx-auto">
                    <i className="bi bi-lightning-charge fs-1 text-white"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Fast and Efficient Service</h5>
                  <p className="card-text text-muted">
                    Our advanced technology enables faster completion times without sacrificing quality.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-lg business-card">
                <div className="card-body text-center p-4">
                  <div className="icon-circle-business bg-business-gold mb-3 mx-auto">
                    <i className="bi bi-shield-check fs-1 text-white"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Reliable Quality Assurance</h5>
                  <p className="card-text text-muted">
                    We uphold rigorous quality standards, ensuring every product is durable and precise.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-lg business-card">
                <div className="card-body text-center p-4">
                  <div className="icon-circle-business bg-business-gold mb-3 mx-auto">
                    <i className="bi bi-trophy fs-1 text-white"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Staying Competitive</h5>
                  <p className="card-text text-muted">
                    Our commitment to innovation ensures top-quality fabrication solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-lg business-card">
                <div className="card-body text-center p-4">
                  <div className="icon-circle-business bg-business-gold mb-3 mx-auto">
                    <i className="bi bi-graph-up fs-1 text-white"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Expanding Services</h5>
                  <p className="card-text text-muted">
                    We continually introduce new offerings to meet evolving requirements.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-lg business-card">
                <div className="card-body text-center p-4">
                  <div className="icon-circle-business bg-business-gold mb-3 mx-auto">
                    <i className="bi bi-hourglass-split fs-1 text-white"></i>
                  </div>
                  <h5 className="card-title fw-bold mb-3">Time-Saving</h5>
                  <p className="card-text text-muted">
                    Reducing lead times by 15% while maintaining quality standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <div className="about-section-business py-5">
        <div className="container">
          <div className="card border-0 shadow-lg overflow-hidden about-card-business">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="display-4 fw-bold business-title-gold">About Us</h1>
                <div className="underline-business mx-auto"></div>
              </div>
              <p className="card-text lead my-3 about-text">
                Our expertise, coupled with our commitment to innovation and sustainability, ensures that working with us is a seamless experience. We provide detailed project management, transparent communication, and timely delivery, allowing our customers to focus on their core goals while we handle the complexities of fabrication.
              </p>
              <p className="card-text lead my-3 about-text">
                When you choose Omkar Steel Fabricators, you're not just getting a service provider—you're gaining a partner dedicated to helping you achieve success with the highest level of professionalism and quality.
              </p>
              <div className="text-center mt-4">
                <div className="trust-badge">
                  <i className="bi bi-patch-check-fill text-gold me-2"></i>
                  <span>ISO Certified Company</span>
                  <i className="bi bi-patch-check-fill text-gold ms-2"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="container-xxl py-5" id="facilities">
        <div className="section-title text-center mb-5">
          <h1 className="display-4 fw-bold gradient-text-business" style={{ fontFamily: 'Source Sans Pro, sans-serif', fontWeight: 600, fontStyle: 'italic' }}>
            Our Facilities
          </h1>
          <div className="underline-business mx-auto"></div>
          <p className="text-muted mt-3">State-of-the-art infrastructure for quality fabrication</p>
        </div>
        <Service />
      </div>
    </div>
  );
};

export default Home;