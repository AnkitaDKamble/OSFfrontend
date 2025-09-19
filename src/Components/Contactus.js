import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import './Contactus.css'; // Assuming Contactus.css exists and provides necessary styling

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
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator

  // useEffect to fetch user profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage

      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Send the token
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setFormData(prevData => ({
              ...prevData,
              name: userData.username || '', // Use username for name field
              email: userData.email || '',
              mobile: userData.mobile || '',
            }));
          } else {
            console.error('Failed to fetch user profile:', response.statusText);
            // If token is invalid or expired, clear it
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
      setIsLoading(false); // Set loading to false once fetch is complete (or skipped)
    };

    fetchUserProfile();
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    // The readOnly attribute on the input element itself prevents user typing.
    // This internal check is kept for consistency with your previous code,
    // though the `readOnly` prop on the input is the primary control.
    if ((name === 'name' && !!localStorage.getItem('token') && formData.name !== '') ||
      (name === 'mobile' && !!localStorage.getItem('token') && formData.mobile !== '')) {
      // If it's a readOnly field, prevent direct user input change via onChange.
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
        // --- MODIFIED HERE: Reset ALL form fields to empty strings ---
        setFormData({
          name: '',
          email: '',
          mobile: '',
          subject: '',
          message: '',
        });
        // -------------------------------------------------------------
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

  // Render a loading spinner while fetching profile data
  if (isLoading) {
    return (
      <Container className="text-center py-5 bg-dark text-light rounded" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading user profile...</p>
      </Container>
    );
  }

  return (
    <>
      <div className="container py-5" style={{ backgroundColor: '#000000', fontWeight: 'bold', fontFamily: 'Arial Black' }}>
        <h1 className="text-center text-light">Enquiry Form</h1>

        <div className="container-fluid bg-dark text-light footer mt-5 pt-5 wow fadeIn" data-wow-delay="0.1s">
          <div className="container py-5">
            <div className="row g-5">
              <div className="col-lg-4 col-md-6">
                <h4 className="text-light mb-4">Address</h4>
                <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>A/P Titave, Tal: Radhanagari, Kolhapur</p>
                <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>PIN: 416208</p>
                <p className="mb-2"><i className="fas fa-phone"></i> +91 9881278909</p>
                <p className="mb-2"><i className="fa fa-envelope me-3"></i>ankitakamblemay@gmail.com</p>
              </div>

              <div className="col-lg-4 col-md-6">
                <h4 className="text-light mb-4">Location</h4>
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mb-4 rounded-md"
                >
                  View on Google Maps
                </a>
                <div className="map-container rounded-md overflow-hidden">
                  <iframe
                    title="Google Map of Omkar Still Fabricators"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7652.668671105453!2d74.1311154!3d16.4586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc059c8855075f1%3A0x4cf04780fc486fff!2sOmkar%20Still%20Fabricators!5e0!3m2!1sen!2sin!4v1756304457880!5m2!1sen!2sin"
                    // We use className for Tailwind styles instead of the style attribute.
                    className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg border-0"
                    // React uses camelCase for HTML attributes like allowfullscreen.
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>

                </div>
              </div>

              <div className="col-lg-4 col-md-6">
                <Container
                  style={{ maxWidth: '400px', marginTop: '20px', backgroundColor: '#000000', fontFamily: 'Arial Black' }}
                  className="bg-dark p-4 rounded"
                >
                  <h2 className="text-center text-light" style={{ fontSize: '1.5rem' }}>Send an Enquiry</h2>

                  {/* Error Alert (Conditionally rendered) */}
                  {showErrorAlert && (
                    <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible className="rounded-md">
                      {errorMessage}
                    </Alert>
                  )}

                  {/* Form for Enquiry */}
                  <Form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <Form.Group controlId="formName" className="mb-3">
                      <Form.Label className="text-light" style={{ fontSize: '0.9rem' }}>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-dark text-light rounded-md"
                        style={{ fontSize: '0.9rem' }}
                        // Read-only if token exists and name is fetched
                        readOnly={!!localStorage.getItem('token') && formData.name !== ''}
                      />
                    </Form.Group>

                    {/* Email Field (Not mandatory) */}
                    <Form.Group controlId="formEmail" className="mb-3">
                      <Form.Label className="text-light" style={{ fontSize: '0.9rem' }}>Email address (Optional)</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-dark text-light rounded-md"
                        placeholder="Enter your email (optional)"
                        style={{ fontSize: '0.9rem' }}
                      // Email is optional and editable even if pre-filled
                      />
                    </Form.Group>

                    {/* Mobile Number Field */}
                    <Form.Group controlId="formMobile" className="mb-3">
                      <Form.Label className="text-light" style={{ fontSize: '0.9rem' }}>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        pattern="[0-9]{10}" // Basic pattern for 10 digits
                        maxLength="10" // Max length for 10 digits
                        required // Mobile number is mandatory
                        className="bg-dark text-light rounded-md"
                        placeholder="e.g., 9876543210"
                        style={{ fontSize: '0.9rem' }}
                        // Read-only if token exists and mobile is fetched
                        readOnly={!!localStorage.getItem('token') && formData.mobile !== ''}
                      />
                    </Form.Group>

                    {/* Subject Field */}
                    <Form.Group controlId="formSubject" className="mb-3">
                      <Form.Label className="text-light" style={{ fontSize: '0.9rem' }}>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-dark text-light rounded-md"
                        style={{ fontSize: '0.9rem' }}
                      />
                    </Form.Group>

                    {/* Message Field */}
                    <Form.Group controlId="formMessage" className="mb-3">
                      <Form.Label className="text-light" style={{ fontSize: '0.9rem' }}>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="bg-dark text-light rounded-md"
                        style={{ fontSize: '0.9rem' }}
                      />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button variant="primary" className="my-3 rounded-md" type="submit" style={{ width: '100%' }}>
                      Submit Enquiry
                    </Button>
                  </Form>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal (Pop-up on screen) */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title style={{ fontFamily: 'Arial Black' }}>Enquiry Sent!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          Thank you for your enquiry! We will get back to you soon.
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleCloseSuccessModal} className="rounded-md">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EnquiryForm;
