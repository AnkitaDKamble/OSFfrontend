import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import './Contactus.css'; // Import your custom CSS file

const Contactus = () => {
  const locationUrl = "https://maps.app.goo.gl/cdEKkudmzpWXRhX86";

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    alert('Thank you for your feedback!');
    setFormData({ name: '', email: '', feedback: '' }); // Reset the form
  };

  return (
    <>
    <div className="container py-5" style={{ backgroundColor: '#000000',fontWeight: 'bold',fontFamily: 'Arial Black' }}>
    <h1 className="text-center text-light">Contact Us</h1>
      <div className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
      
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Address</h4>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>A/P Titave Tal: Radhanagari, District: Kolhapur.</p>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>PIN: 416208</p>
              <p className="mb-2"><i className="fas fa-phone"></i> +91 9881278909</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>ankitakamblemay@gmail.com</p>

              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-youtube"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <h4 className="text-light mb-4">Location</h4>
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mb-4"
              >
                View on Google Maps
              </a>
              {/* Embed Google Map below the button */}
              <div className="map-container">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d315104.40839635594!2d74.22257444775103!3d16.800539197186222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6d28c8cd22b%3A0x91203e25a93d3a63!2sRadhanagari%2C%20Maharashtra%20416208!5e0!3m2!1sen!2sin!4v1696966500850!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <Container style={{ maxWidth: '600px', marginTop: '20px' }} className="bg-dark p-4 rounded">
                <h2 className="text-center text-light">Feedback Form</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label className="text-light">Name:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label className="text-light">Email:</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  <Form.Group controlId="formFeedback">
                    <Form.Label className="text-light">Feedback:</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      rows={4}
                      required
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                  <Button variant="primary" className="my-3" type="submit" style={{ width: '100%' }}>
                    Submit
                  </Button>
                </Form>
              </Container>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Contactus;
