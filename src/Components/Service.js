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
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

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

  // Handle order submission with Razorpay payment
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
      setPaymentProcessing(true);

      // Create Razorpay order
      const orderResponse = await axios.post(
        "http://localhost:5000/api/create-razorpay-order",
        { amount: orderDetails.amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (orderResponse.data.success) {
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add to your .env file
          amount: orderResponse.data.order.amount,
          currency: orderResponse.data.order.currency,
          name: "Omkar Steel Fabricators",
          description: `Order for ${orderDetails.title}`,
          image: "/logo.png",
          order_id: orderResponse.data.order.id,
          handler: async function (response) {
            await verifyPayment(response);
          },
          prefill: {
            name: "Customer",
            email: "customer@example.com",
            contact: "9999999999"
          },
          notes: {
            address: "Customer Address"
          },
          theme: {
            color: "#3399cc"
          },
          modal: {
            ondismiss: function() {
              setPaymentProcessing(false);
              setError("Payment was cancelled");
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response) {
          setPaymentProcessing(false);
          setError(`Payment failed: ${response.error.description}`);
        });
        razorpay.open();
      } else {
        setError("Failed to create payment order");
        setPaymentProcessing(false);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      if (error.response) {
        setError(error.response.data.message || "Error initializing payment. Please try again.");
      } else {
        setError("Error initializing payment: An unknown error occurred.");
      }
      setPaymentProcessing(false);
    }
  };

  // Verify payment after successful transaction
  const verifyPayment = async (paymentResponse) => {
    try {
      const token = localStorage.getItem("token");
      
      const verifyResponse = await axios.post(
        "http://localhost:5000/api/verify-payment",
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          orderDetails: orderDetails
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (verifyResponse.data.success) {
        setSuccessMessage("Payment successful! Order confirmed.");
        setShowModal(false);
        setOrderDetails({ title: "", length: "", width: "", amount: 0 });
        setError("");
      } else {
        setError("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      setError("Error verifying payment. Please contact support.");
    } finally {
      setPaymentProcessing(false);
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
            </Form.Group>
          </Form>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={paymentProcessing}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleOrderSubmit}
            disabled={paymentProcessing || orderDetails.amount <= 0}
          >
            {paymentProcessing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `Pay ₹${orderDetails.amount.toFixed(2)}`
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
          <Button variant="primary" onClick={handleCloseLoginPrompt}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Service;