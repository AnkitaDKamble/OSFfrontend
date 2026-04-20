import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Col, Row, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Service.css';

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // NEW: Success popup state
  const [orderDetails, setOrderDetails] = useState({
    title: "",
    length: "",
    width: "",
    amount: 0,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const navigate = useNavigate();

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/services");

        if (response.data && Array.isArray(response.data.services)) {
          setServices(response.data.services);
        } else {
          console.error("Unexpected data structure for services:", response.data);
          setError("Failed to load services: Unexpected data format from server.");
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        if (err.response) {
          setError(err.response.data.message || `Failed to load services: ${err.response.statusText}`);
        } else if (err.request) {
          setError("Failed to load services: No response from server. Check if backend is running.");
        } else {
          setError("Failed to load services: An unknown error occurred.");
        }
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = (name === "length" || name === "width") ? parseFloat(value) : value;

    setOrderDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [name]: newValue,
      };

      if ((name === "length" || name === "width") && !isNaN(updatedDetails.length) && !isNaN(updatedDetails.width)) {
        const selectedService = services.find(
          (service) => service.title === updatedDetails.title
        );

        if (selectedService) {
          const { pricePerSquareFoot } = selectedService;
          const calculatedAmount = updatedDetails.length * updatedDetails.width * pricePerSquareFoot;
          updatedDetails.amount = calculatedAmount || 0;
        }
      }
      return updatedDetails;
    });
  };

  // Handle order submission
  const handleOrderSubmit = async () => {
    setError("");
    setSuccessMessage("");
    const token = localStorage.getItem("token");

    const { title, length, width, amount } = orderDetails;

    if (!token) {
      setShowModal(false);
      setShowLoginPrompt(true);
      return;
    }

    if (!title || isNaN(length) || isNaN(width) || length <= 0 || width <= 0 || amount <= 0) {
      setError("Please ensure title is selected, length and width are positive numbers, and amount is calculated.");
      return;
    }

    try {
      setOrderProcessing(true);

      const orderResponse = await axios.post(
        "http://localhost:5000/api/create-order",
        {
          title: orderDetails.title,
          length: orderDetails.length,
          width: orderDetails.width,
          orderAmount: orderDetails.amount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (orderResponse.data) {
        // Show success popup instead of alert
        setShowSuccessPopup(true);
        setShowModal(false);
        setOrderDetails({ title: "", length: "", width: "", amount: 0 });
        setError("");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      if (error.response) {
        setError(error.response.data.message || "Error placing order. Please try again.");
      } else {
        setError("Error placing order: An unknown error occurred.");
      }
    } finally {
      setOrderProcessing(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setOrderDetails({ title: "", length: "", width: "", amount: 0 });
  };

  // Close success popup
  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
  };

  // Show modal and check login status
  const handleShowModal = (serviceTitle) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const selectedService = services.find(
      (service) => service.title === serviceTitle
    );

    if (selectedService) {
      setOrderDetails({
        title: serviceTitle,
        length: "",
        width: "",
        amount: 0,
      });
      setShowModal(true);
    } else {
      setError("Selected service not found.");
    }
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
    navigate("/login");
  };

  return (
    <div className="services-container">
      <div className="services-header">
        <h1 className="services-title">
          <i className="bi bi-tools me-3"></i>
          Omkar Steel Fabricators - Services
        </h1>
        <div className="title-underline"></div>
        <p className="services-subtitle">Premium quality steel fabrication at competitive prices</p>
      </div>

      {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}

      {loading ? (
        <div className="text-center loading-container">
          <Spinner animation="border" variant="warning" role="status">
            <span className="visually-hidden">Loading services...</span>
          </Spinner>
          <p className="mt-2 text-muted">Loading services...</p>
        </div>
      ) : (
        <Row className="g-4">
          {services.length > 0 ? (
            services.map((service) => (
              <Col md={6} lg={4} key={service._id}>
                <div className="service-card-wrapper">
                  <Card className="service-card h-100">
                    <div className="card-image-wrapper">
                      <Card.Img
                        variant="top"
                        src={
                          service.imagePath
                            ? `http://localhost:5000${service.imagePath}`
                            : "https://placehold.co/400x200/2a2a2a/ffc107?text=Steel+Service"
                        }
                        alt={service.title}
                        className="service-card-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/2a2a2a/ffc107?text=Steel+Service'; }}
                      />
                      <div className="card-overlay">
                        <span className="price-badge">₹{service.pricePerSquareFoot}/sq.ft</span>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title className="service-card-title">
                        {service.title}
                      </Card.Title>
                      <Card.Text className="service-card-text">
                        Professional steel fabrication with precision and quality assurance. Perfect for industrial and residential needs.
                      </Card.Text>
                      <div className="service-footer">
                        <div className="price-info">
                          <small>Starting from</small>
                          <strong className="price-highlight">₹{service.pricePerSquareFoot}</strong>
                          <small>per sq. ft.</small>
                        </div>
                        <Button
                          variant="business-primary"
                          className="order-btn"
                          onClick={() => handleShowModal(service.title)}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Place Order
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <div className="empty-state">
                <i className="bi bi-tools display-1 text-muted"></i>
                <p className="mt-3 text-muted">No services available at the moment.</p>
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* Order Modal - Business Styled */}
      <Modal show={showModal} onHide={handleCloseModal} centered className="business-modal">
        <Modal.Header closeButton className="business-modal-header">
          <Modal.Title>
            <i className="bi bi-file-text me-2"></i>
            Place Your Order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="business-modal-body">
          <Form>
            <div className="order-summary">
              <div className="summary-item">
                <span className="summary-label">Product:</span>
                <span className="summary-value">{orderDetails.title}</span>
              </div>
            </div>
            <Form.Group controlId="formLength" className="mb-3">
              <Form.Label>
                <i className="bi bi-rulers me-2"></i>
                Length (in ft)
              </Form.Label>
              <Form.Control
                type="number"
                name="length"
                value={orderDetails.length}
                onChange={handleInputChange}
                placeholder="Enter length"
                min="0"
                step="0.1"
                className="business-input"
              />
            </Form.Group>
            <Form.Group controlId="formWidth" className="mb-3">
              <Form.Label>
                <i className="bi bi-aspect-ratio me-2"></i>
                Width (in ft)
              </Form.Label>
              <Form.Control
                type="number"
                name="width"
                value={orderDetails.width}
                onChange={handleInputChange}
                placeholder="Enter width"
                min="0"
                step="0.1"
                className="business-input"
              />
            </Form.Group>
            <div className="calculation-box">
              <div className="calculation-row">
                <span>Length: {orderDetails.length || 0} ft</span>
                <span>×</span>
                <span>Width: {orderDetails.width || 0} ft</span>
                <span>=</span>
                <span>{((orderDetails.length || 0) * (orderDetails.width || 0)).toFixed(2)} sq.ft</span>
              </div>
              <div className="calculation-total">
                <span>Total Amount:</span>
                <strong className="amount-highlight">₹{orderDetails.amount.toFixed(2)}</strong>
              </div>
            </div>
          </Form>
          {error && <div className="error-message">{error}</div>}
        </Modal.Body>
        <Modal.Footer className="business-modal-footer">
          <Button variant="business-secondary" onClick={handleCloseModal} disabled={orderProcessing}>
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button 
            variant="business-primary" 
            onClick={handleOrderSubmit}
            disabled={orderProcessing || orderDetails.amount <= 0}
          >
            {orderProcessing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Confirm Order ₹{orderDetails.amount.toFixed(2)}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Popup Modal - NEW */}
      <Modal show={showSuccessPopup} onHide={handleCloseSuccessPopup} centered className="success-popup-modal">
        <Modal.Header closeButton className="success-popup-header">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>
            Order Placed Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="success-popup-body">
          <div className="success-icon">
            <i className="bi bi-emoji-smile-fill"></i>
          </div>
          <h3>Thank You for Your Order!</h3>
          <p>Your order has been placed successfully.</p>
          <p className="text-muted small">We will process your order soon.</p>
        </Modal.Body>
        <Modal.Footer className="success-popup-footer">
          <Button className="success-popup-btn" onClick={handleCloseSuccessPopup}>
            <i className="bi bi-check2-circle me-2"></i>
            Continue Shopping
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Login Prompt Modal - Business Styled */}
      <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)} centered className="business-modal">
        <Modal.Header closeButton className="business-modal-header">
          <Modal.Title>
            <i className="bi bi-shield-lock me-2"></i>
            Login Required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="business-modal-body text-center">
          <i className="bi bi-box-arrow-in-right display-4 text-warning mb-3 d-block"></i>
          <p>You need to log in to place an order. Please log in first.</p>
        </Modal.Body>
        <Modal.Footer className="business-modal-footer">
          <Button variant="business-secondary" onClick={() => setShowLoginPrompt(false)}>
            <i className="bi bi-arrow-left me-2"></i>
            Cancel
          </Button>
          <Button variant="business-primary" onClick={handleCloseLoginPrompt}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Service;