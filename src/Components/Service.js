import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Col, Row } from "react-bootstrap";
import axios from "axios";

const Service = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    title: "",
    length: "",
    width: "",
    amount: 0,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        debugger
        const response = await axios.get("http://localhost:5000/api/services");
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services.");
      }
    };

    fetchServices();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Dynamically update the amount if length and width are updated
    if (name === "length" || name === "width") {
      const updatedDetails = {
        ...orderDetails,
        [name]: value,
      };

      // Find the price of the selected service
      const selectedService = services.find(
        (service) => service.title === updatedDetails.title
      );

      if (selectedService) {
        const { pricePerSquareFoot } = selectedService;
        const calculatedAmount =
          updatedDetails.length * updatedDetails.width * pricePerSquareFoot;

        updatedDetails.amount = calculatedAmount || 0; // Calculate dynamically
      }

      setOrderDetails(updatedDetails);
    } else {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  // Handle order submission
  const handleOrderSubmit = async () => {
    debugger
    const token = localStorage.getItem("token"); // Use the correct key 'token' for JWT
    const { title, length, width, amount } = orderDetails;

    // Basic validation
    if (!title || !length || !width || !amount) {
      setError("All fields are required.");
      return;
    }

    if (!token) {
      setError("You must be logged in to place an order.");
      return;
    }

    try {
      debugger
      const response = await axios.post(
        "http://localhost:5000/api/create-order",
        {
          title,
          length,
          width,
          orderAmount: amount, // Make sure the backend expects this field
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in header
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Order placed successfully!");
        setShowModal(false);
        setOrderDetails({ title: "", length: "", width: "", amount: 0 });
        setError("");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setError("Error placing order. Please try again.");
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  // Show modal and initialize order details
  const handleShowModal = (serviceTitle) => {
    const selectedService = services.find(
      (service) => service.title === serviceTitle
    );

    setOrderDetails({
      title: serviceTitle,
      length: "",
      width: "",
      amount: 0,
    });

    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Omkar Steel Fabricators - Services</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <Row>
        {services.map((service) => (
          <Col md={4} key={service._id} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Img
                variant="top"
                src={
                  service.imagePath
                    ? `http://localhost:5000${service.imagePath}`
                    : "https://via.placeholder.com/150"
                }
                alt={service.title}
                style={{ height: "200px", objectFit: "cover" }}
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
        ))}
      </Row>

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
    </div>
  );
};

export default Service;
