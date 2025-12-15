import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Col, Row, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
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

      // Send order directly to backend
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
        setSuccessMessage("Order placed successfully!");
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Omkar Steel Fabricators - Services</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading services...</span>
          </Spinner>
          <p className="mt-2">Loading services...</p>
        </div>
      ) : (
        <Row>
          {services.length > 0 ? (
            services.map((service) => (
              <Col md={4} key={service._id} className="mb-4">
                <Card className="h-100 shadow">
                  <Card.Img
                    variant="top"
                    src={
                      service.imagePath
                        ? `http://localhost:5000${service.imagePath}`
                        : "https://placehold.co/400x200/555/fff?text=No+Image"
                    }
                    alt={service.title}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/555/fff?text=No+Image'; }}
                  />
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text>
                      Price: ₹{service.pricePerSquareFoot} per sq. ft.
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleShowModal(service.title)}
                    >
                      Place Order
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <p className="text-muted">No services available at the moment.</p>
            </Col>
          )}
        </Row>
      )}

      {/* Order Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Place Your Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Product Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={orderDetails.title}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formLength" className="mb-3">
              <Form.Label>Length (in ft)</Form.Label>
              <Form.Control
                type="number"
                name="length"
                value={orderDetails.length}
                onChange={handleInputChange}
                placeholder="Enter length"
                min="0"
                step="0.1"
              />
            </Form.Group>
            <Form.Group controlId="formWidth" className="mb-3">
              <Form.Label>Width (in ft)</Form.Label>
              <Form.Control
                type="number"
                name="width"
                value={orderDetails.width}
                onChange={handleInputChange}
                placeholder="Enter width"
                min="0"
                step="0.1"
              />
            </Form.Group>
            <Form.Group controlId="formAmount" className="mb-3">
              <Form.Label>Calculated Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={orderDetails.amount.toFixed(2)}
                readOnly
              />
              <Form.Text className="text-muted">
                Amount = Length × Width × Price per sq. ft.
              </Form.Text>
            </Form.Group>
          </Form>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={orderProcessing}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleOrderSubmit}
            disabled={orderProcessing || orderDetails.amount <= 0}
          >
            {orderProcessing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Placing Order...
              </>
            ) : (
              `Place Order ₹${orderDetails.amount.toFixed(2)}`
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Login Prompt Modal */}
      <Modal show={showLoginPrompt} onHide={() => setShowLoginPrompt(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to log in to place an order. Please log in first.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginPrompt(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCloseLoginPrompt}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Service;