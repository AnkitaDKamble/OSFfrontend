import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const Careers = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
    alert('Thank you for your application!');
    setFormData({ name: '', email: '', phone: '', resume: null, message: '' }); // Reset the form
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#808080' }}>
      <h1 className="text-center text-light">Careers</h1>
      <Container className="mt-5">
        <h2 className="text-center text-light mb-4">Career Application Form</h2>
        <Form onSubmit={handleSubmit} className="bg-dark p-4 rounded text-light">
          <Row>
            <Col md={6}>
              <Form.Group controlId="formName">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-dark text-light form-control-sm" // Reduced size
                  aria-label="Name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-dark text-light form-control-sm" // Reduced size
                  aria-label="Email"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-dark text-light form-control-sm" // Reduced size
                  aria-label="Phone Number"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formResume">
                <Form.Label>Resume:</Form.Label>
                <Form.Control
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  required
                  className="bg-dark text-light form-control-sm" // Reduced size
                  accept=".pdf,.doc,.docx" // Specify accepted file types
                />
                {formData.resume && <small className="text-light">{formData.resume.name}</small>} {/* Display file name */}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formMessage">
            <Form.Label>Message:</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="bg-dark text-light form-control-sm" // Reduced size
              aria-label="Message"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mt-3">
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default Careers;
