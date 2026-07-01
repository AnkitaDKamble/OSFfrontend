import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import './Contactus.css';

const EnquiryForm = () => {
  const locationUrl = "https://maps.app.goo.gl/cdEKkudmzpWXRhX86";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              name: userData.username || '',
              email: userData.email || '',
              mobile: userData.mobile || '',
            }));
          } else {
            console.error('Failed to fetch user profile:', response.statusText);
            localStorage.removeItem('token');
            setErrorMessage('Failed to load profile for autofill. Please log in again if needed.');
            setShowErrorAlert(true);
          }
        } catch (error) {
          console.error('Network error fetching profile:', error);
          setErrorMessage('Network error loading profile for autofill. Please check your connection.');
          setShowErrorAlert(true);
        }
      }
      setIsLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'name' && !!localStorage.getItem('token') && formData.name !== '') ||
      (name === 'mobile' && !!localStorage.getItem('token') && formData.mobile !== '')) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShowSuccessModal(false);
    setShowErrorAlert(false);
    setErrorMessage('');

    console.log('Enquiry submitted:', formData);

    try {
      const response = await fetch('http://localhost:5000/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Enquiry submitted successfully:', data);
        setShowSuccessModal(true);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          subject: '',
          message: '',
        });
      } else {
        console.error('Failed to submit enquiry:', data.message || 'Unknown error');
        setErrorMessage(data.message || 'Failed to submit enquiry. Please try again.');
        setShowErrorAlert(true);
        setTimeout(() => setShowErrorAlert(false), 5000);
      }
    } catch (error) {
      console.error('Network error submitting enquiry:', error);
      setErrorMessage('Network error: Could not connect to the server. Please ensure the backend is running.');
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 7000);
    }
  };

  const handleCloseSuccessModal = () => setShowSuccessModal(false);

  if (isLoading) {
    return (
      <div className="contact-loading">
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="contact-page">
        {/* Hero Section */}
        <div className="contact-hero">
          <div className="contact-hero-overlay"></div>
          <div className="contact-hero-content">
            <h1 className="contact-hero-title">
              <i className="bi bi-envelope-paper me-3"></i>
              Contact Us
            </h1>
            <div className="hero-underline"></div>
            <p className="contact-hero-subtitle">Get in touch with us for any inquiries</p>
          </div>
        </div>

        <div className="contact-main">
          <div className="container">
            {/* 2 Columns Row - Address and Map */}
            <div className="row g-5 mb-5">
              {/* Address Column */}
              <div className="col-lg-6 col-md-12">
                <div className="contact-info-card">
                  <h4 className="contact-info-title">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    Our Address
                  </h4>
                  <div className="contact-info-divider"></div>
                  <div className="contact-info-item">
                    <i className="bi bi-building me-3"></i>
                    <span>A/P Titave, Tal: Radhanagari, Kolhapur</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="bi bi-pin-map-fill me-3"></i>
                    <span>PIN: 416208</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="bi bi-telephone-fill me-3"></i>
                    <span>+91 9881278909</span>
                  </div>
                  <div className="contact-info-item">
                    <i className="bi bi-envelope-fill me-3"></i>
                    <span>ankitakamblemay@gmail.com</span>
                  </div>

                  <div className="business-hours mt-4">
                    <h5 className="text-gold">
                      <i className="bi bi-clock-history me-2"></i>
                      Business Hours
                    </h5>
                    <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Map Column */}
              <div className="col-lg-6 col-md-12">
                <div className="map-card">
                  <h4 className="contact-info-title">
                    <i className="bi bi-map-fill me-2"></i>
                    Find Us
                  </h4>
                  <div className="contact-info-divider"></div>
                  <a
                    href={locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-map mb-3"
                  >
                    <i className="bi bi-compass me-2"></i>
                    Open in Google Maps
                  </a>
                  <div className="map-container">
                    <iframe
                      title="Google Map of Omkar Steel Fabricators"
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7652.668671105453!2d74.1311154!3d16.4586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc059c8855075f1%3A0x4cf04780fc486fff!2sOmkar%20Still%20Fabricators!5e0!3m2!1sen!2sin!4v1756304457880!5m2!1sen!2sin"
                      className="map-iframe"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry Form - Below Both Columns */}
            <div className="row">
              <div className="col-12">
                <div className="enquiry-card">
                  <h4 className="contact-info-title">
                    <i className="bi bi-chat-dots-fill me-2"></i>
                    Send an Enquiry
                  </h4>
                  <div className="contact-info-divider"></div>

                  {showErrorAlert && (
                    <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible className="custom-alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {errorMessage}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group controlId="formName" className="mb-3">
                          <Form.Label className="form-label">
                            <i className="bi bi-person-fill me-2"></i>
                            Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="business-input"
                            placeholder="Enter your name"
                            readOnly={!!localStorage.getItem('token') && formData.name !== ''}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group controlId="formEmail" className="mb-3">
                          <Form.Label className="form-label">
                            <i className="bi bi-envelope-fill me-2"></i>
                            Email Address (Optional)
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="business-input"
                            placeholder="Enter your email"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group controlId="formMobile" className="mb-3">
                          <Form.Label className="form-label">
                            <i className="bi bi-phone-fill me-2"></i>
                            Mobile Number
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            maxLength="10"
                            required
                            className="business-input"
                            placeholder="Enter 10-digit mobile number"
                            readOnly={!!localStorage.getItem('token') && formData.mobile !== ''}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group controlId="formSubject" className="mb-3">
                          <Form.Label className="form-label">
                            <i className="bi bi-tag-fill me-2"></i>
                            Subject
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="business-input"
                            placeholder="Enter subject"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <Form.Group controlId="formMessage" className="mb-4">
                      <Form.Label className="form-label">
                        <i className="bi bi-chat-text-fill me-2"></i>
                        Message
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="business-input business-textarea"
                        placeholder="Enter your message here..."
                      />
                    </Form.Group>

                    <Button variant="business-primary" className="submit-btn" type="submit">
                      <i className="bi bi-send-fill me-2"></i>
                      Submit Enquiry
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered className="business-modal">
        <Modal.Header closeButton className="business-modal-header">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Enquiry Sent!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="business-modal-body text-center">
          <i className="bi bi-envelope-check display-1 text-gold mb-3 d-block"></i>
          <p>Thank you for your enquiry!</p>
          <p className="text-muted">We will get back to you soon.</p>
        </Modal.Body>
        <Modal.Footer className="business-modal-footer">
          <Button variant="business-secondary" onClick={handleCloseSuccessModal}>
            <i className="bi bi-x-circle me-2"></i>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnquiryForm;