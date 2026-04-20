import React from 'react';
import './Aboutus.css'; // Create this CSS file

const Aboutus = () => {
    return (
        <div className="aboutus-container">
            <div className="aboutus-hero">
                <div className="aboutus-hero-overlay"></div>
                <div className="aboutus-hero-content">
                    <h1 className="aboutus-hero-title">
                        <i className="bi bi-building me-3"></i>
                        About Us
                    </h1>
                    <div className="hero-underline"></div>
                    <p className="aboutus-hero-subtitle">
                        Excellence in Steel Fabrication Since 2000
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        {/* Main About Section */}
                        <div className="about-card main-about">
                            <div className="about-card-icon">
                                <i className="bi bi-info-circle-fill"></i>
                            </div>
                            <h2 className="about-card-title">Who We Are</h2>
                            <div className="card-underline"></div>
                            <p className="about-card-text">
                                Our expertise, coupled with our commitment to innovation and sustainability, ensures that working with us is a seamless experience. We provide detailed project management, transparent communication, and timely delivery, allowing our customers to focus on their core goals while we handle the complexities of fabrication.
                            </p>
                            <p className="about-card-text mt-3">
                                When you choose Omkar Steel Fabricators, you're not just getting a service provider—you're gaining a partner dedicated to helping you achieve success with the highest level of professionalism and quality.
                            </p>
                        </div>

                        {/* Vision & Mission Row */}
                        <div className="row g-4 mt-4">
                            {/* Vision Section */}
                            <div className="col-md-6">
                                <div className="vision-card">
                                    <div className="vision-icon">
                                        <i className="bi bi-eye-fill"></i>
                                    </div>
                                    <h3 className="vision-title">Our Vision</h3>
                                    <div className="card-underline-small"></div>
                                    <p className="vision-text">
                                        To become the most trusted partner for customers seeking high-quality steel fabrication solutions. We aim to provide unparalleled craftsmanship, timely delivery, and innovative designs that meet the unique needs of our customers, ensuring their satisfaction and success in every project.
                                    </p>
                                </div>
                            </div>

                            {/* Mission Section */}
                            <div className="col-md-6">
                                <div className="mission-card">
                                    <div className="mission-icon">
                                        <i className="bi bi-bullseye"></i>
                                    </div>
                                    <h3 className="mission-title">Our Mission</h3>
                                    <div className="card-underline-small"></div>
                                    <p className="mission-text">
                                        Our mission is to provide exceptional steel fabrication services that prioritize customer satisfaction. We are committed to delivering precision-engineered solutions, tailored to your specifications, while maintaining the highest standards of quality, efficiency, and professionalism. Our focus is on making your vision a reality, offering reliable and innovative solutions to meet your needs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Core Values Section */}
                        <div className="values-section mt-5">
                            <h2 className="values-title">
                                <i className="bi bi-star-fill me-2"></i>
                                Our Core Values
                            </h2>
                            <div className="card-underline values-underline"></div>
                            <div className="row g-4 mt-3">
                                <div className="col-md-3 col-sm-6">
                                    <div className="value-item">
                                        <div className="value-icon">
                                            <i className="bi bi-trophy"></i>
                                        </div>
                                        <h4>Quality</h4>
                                        <p>Uncompromising quality in every project</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="value-item">
                                        <div className="value-icon">
                                            <i className="bi bi-clock-history"></i>
                                        </div>
                                        <h4>Punctuality</h4>
                                        <p>On-time delivery guaranteed</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="value-item">
                                        <div className="value-icon">
                                            <i className="bi bi-shield-check"></i>
                                        </div>
                                        <h4>Integrity</h4>
                                        <p>Transparent & honest business</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="value-item">
                                        <div className="value-icon">
                                            <i className="bi bi-lightbulb"></i>
                                        </div>
                                        <h4>Innovation</h4>
                                        <p>Modern & innovative solutions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="stats-section mt-5">
                            <div className="row g-4">
                                <div className="col-md-3 col-sm-6">
                                    <div className="stat-card">
                                        <div className="stat-number" data-count="25">25+</div>
                                        <div className="stat-label">Years Experience</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="stat-card">
                                        <div className="stat-number" data-count="500">500+</div>
                                        <div className="stat-label">Projects Completed</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="stat-card">
                                        <div className="stat-number" data-count="200">200+</div>
                                        <div className="stat-label">Happy Clients</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6">
                                    <div className="stat-card">
                                        <div className="stat-number" data-count="15">15+</div>
                                        <div className="stat-label">Expert Team</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Aboutus;