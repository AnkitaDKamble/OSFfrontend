import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Col, Row, Spinner, Alert } from "react-bootstrap"; // Added Spinner, Alert
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
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
  const navigate = useNavigate();

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true); // Start loading
      setError(""); // Clear previous errors
      try {
        const response = await axios.get("http://localhost:5000/api/services");

        // --- CRUCIAL FIX: Access response.data.services ---
        if (response.data && Array.isArray(response.data.services)) {
          setServices(response.data.services);
        } else {
          // Handle cases where the data structure is not as expected
          console.error("Unexpected data structure for services:", response.data);
          setError("Failed to load services: Unexpected data format from server.");
          setServices([]); // Ensure services is an empty array to prevent map error
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        // More descriptive error message for network/API failures
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(err.response.data.message || `Failed to load services: ${err.response.statusText}`);
        } else if (err.request) {
          // Request was made but no response received
          setError("Failed to load services: No response from server. Check if backend is running.");
        } else {
          // Something else happened in setting up the request
          setError("Failed to load services: An unknown error occurred.");
        }
        setServices([]); // Ensure services is an empty array
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs once on mount

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only update orderDetails if the input is valid (numeric for length/width)
    const newValue = (name === "length" || name === "width") ? parseFloat(value) : value;

    setOrderDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [name]: newValue,
      };

      // Recalculate amount if length or width changed and are valid numbers
      if ((name === "length" || name === "width") && !isNaN(updatedDetails.length) && !isNaN(updatedDetails.width)) {
        const selectedService = services.find(
          (service) => service.title === updatedDetails.title
        );

        if (selectedService) {
          const { pricePerSquareFoot } = selectedService;
          const calculatedAmount =
            updatedDetails.length * updatedDetails.width * pricePerSquareFoot;
          updatedDetails.amount = calculatedAmount || 0; // Ensure it's 0 if calculation results in NaN/null
        }
      }
      return updatedDetails;
    });
  };

  // Handle order submission
  const handleOrderSubmit = async () => {
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages
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
      const response = await axios.post(
        "http://localhost:5000/api/create-order", // Confirmed this is the correct endpoint from server.js
        {
          title,
          length,
          width,
          orderAmount: amount, // Backend expects 'orderAmount'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Order placed successfully!");
        setShowModal(false);
        setOrderDetails({ title: "", length: "", width: "", amount: 0 }); // Reset form
        setError("");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      if (error.response) {
        setError(error.response.data.message || "Error placing order. Please try again.");
      } else if (error.request) {
        setError("Error placing order: No response from server. Please check backend.");
      } else {
        setError("Error placing order: An unknown error occurred.");
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setOrderDetails({ title: "", length: "", width: "", amount: 0 }); // Reset form on close
  };

  // Show modal and check login status
  const handleShowModal = (serviceTitle) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    // Find the selected service to initialize orderDetails with its title
    const selectedService = services.find(
      (service) => service.title === serviceTitle
    );

    if (selectedService) {
      setOrderDetails({
        title: serviceTitle,
        length: "", // Keep these empty for user input
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
    navigate("/login"); // Redirect to login page
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
                        ? `http://localhost:5000${service.imagePath}` // Ensure this path matches your static serve setup
                        : "https://placehold.co/400x200/555/fff?text=No+Image" // Fallback placeholder
                    }
                    alt={service.title}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/555/fff?text=No+Image'; }} // Fallback on error
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
              />
            </Form.Group>
            <Form.Group controlId="formAmount" className="mb-3">
              <Form.Label>Calculated Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={orderDetails.amount}
                readOnly
              />
            </Form.Group>
          </Form>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOrderSubmit}>
            Submit Order
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
          <Button variant="primary" onClick={handleCloseLoginPrompt}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Service;
