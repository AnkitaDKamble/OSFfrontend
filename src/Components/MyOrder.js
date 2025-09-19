import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap'; // Import Form, Spinner, Alert

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentOrderForFeedback, setCurrentOrderForFeedback] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'accept' or 'reject'
  const [feedbackValidationError, setFeedbackValidationError] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');


  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    setActionSuccessMessage(''); // Clear previous success messages
    try {
      const token = localStorage.getItem('token'); // Get customer's token
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/my-orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        setError(`Server responded with non-JSON data or empty response: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(result.message || 'Failed to fetch orders');
        setLoading(false);
        return;
      }

      if (Array.isArray(result.orders)) {
        // --- CRUCIAL CHANGE: Filter out 'accepted', 'rejected', AND 'cancelled' orders ---
        const activeOrders = result.orders.filter(
          (order) =>
            order.status !== 'accepted' &&
            order.status !== 'rejected' &&
            order.status !== 'cancelled' // NEW: Exclude cancelled orders from this customer's active view
        );
        setOrders(activeOrders);
      } else {
        setError('Unexpected data format for orders from server.');
        setOrders([]);
      }
    } catch (err) {
      console.error('Network error fetching orders:', err);
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel order (for 'pending' status)
  const handleCancelOrder = async (orderId) => {
    setError(''); // Clear previous errors
    setActionSuccessMessage(''); // Clear previous success messages
    // Replaced window.confirm with a custom modal for better UX (as per guidelines)
    if (!await confirmAction("Are you sure you want to cancel this order?")) {
      return; // User cancelled the action
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setError(errorResult.message || 'Failed to cancel order');
        return;
      }

      setActionSuccessMessage('Order cancelled successfully!');
      fetchOrders(); // Refresh orders after cancellation
    } catch (err) {
      console.error('Network error cancelling order:', err);
      setError('An error occurred while cancelling order.');
    }
  };

  // Custom confirmation function (replaces window.confirm)
  const confirmAction = (message) => {
    return new Promise((resolve) => {
      // You can implement a Bootstrap modal here for confirmation
      // For simplicity, let's keep it as a basic alert for now,
      // but ideally you'd have a state-driven modal for this.
      if (window.confirm(message)) { // Temporarily using window.confirm
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  // Open feedback modal for Accept/Reject
  const openFeedbackModal = (order, type) => {
    setCurrentOrderForFeedback(order);
    setFeedbackType(type);
    setFeedbackMessage(order.feedback || ''); // Pre-fill if existing feedback
    setFeedbackValidationError(''); // Clear previous validation errors
    setShowFeedbackModal(true);
  };

  // Close feedback modal
  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setCurrentOrderForFeedback(null);
    setFeedbackMessage('');
    setFeedbackType('');
    setFeedbackValidationError('');
  };

  // Submit feedback (Accept/Reject action)
  const submitFeedback = async () => {
    setError(''); // Clear previous errors
    setActionSuccessMessage(''); // Clear previous success messages
    setFeedbackValidationError(''); // Clear internal validation error

    if (feedbackType === 'reject' && !feedbackMessage.trim()) {
      setFeedbackValidationError('Feedback is mandatory for rejecting an order.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        closeFeedbackModal();
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${currentOrderForFeedback._id}/review`, {
        method: 'PUT', // Use PUT for updating
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: feedbackType, // 'accept' or 'reject'
          feedback: feedbackMessage.trim(),
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setError(errorResult.message || `Failed to ${feedbackType} order.`);
        closeFeedbackModal();
        return;
      }

      const successMsg = feedbackType === 'accepted' ? 'Order accepted successfully!' : 'Order rejected successfully!';
      setActionSuccessMessage(successMsg);
      fetchOrders(); // Re-fetch orders to reflect the new status (which will now filter out this order)
      closeFeedbackModal(); // Close modal on success
    } catch (err) {
      console.error('Network error submitting feedback:', err);
      setError('An error occurred while submitting feedback.');
      closeFeedbackModal();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Active Orders</h2> {/* Title changed for clarity */}

      {error && <Alert variant="danger">{error}</Alert>}
      {actionSuccessMessage && <Alert variant="success">{actionSuccessMessage}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </Spinner>
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : (
        <div>
          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-dark table-hover rounded overflow-hidden">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Feedback</th> {/* Display feedback */}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.title}</td>
                      <td>₹{order.orderAmount}</td>
                      <td>
                        <span className={`badge ${
                            order.status === 'pending' ? 'bg-info' :
                            order.status === 'manufacturing started' ? 'bg-warning text-dark' :
                            order.status === 'completed' ? 'bg-secondary' :
                            order.status === 'delivered' ? 'bg-primary' : // Changed to primary to distinguish from accepted
                            // No need for 'accepted', 'rejected', 'cancelled' here as they are filtered out
                            'bg-light text-dark' // Default/fallback
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>{order.feedback || '-'}</td> {/* Display feedback or '-' if none */}
                      <td>
                        {/* Only show Cancel button if status is pending */}
                        {order.status === 'pending' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelOrder(order._id)}
                            className="rounded-md"
                          >
                            Cancel
                          </Button>
                        )}
                        {/* Show Accept/Reject buttons only if status is delivered */}
                        {order.status === 'delivered' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => openFeedbackModal(order, 'accept')}
                              className="me-2 rounded-md"
                            >
                              Accept
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => openFeedbackModal(order, 'reject')}
                              className="rounded-md"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {/* No action buttons for other statuses (manufacturing started, completed) */}
                        {(order.status === 'manufacturing started' || order.status === 'completed') && (
                             <span className="badge bg-secondary">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted">No active orders available. Your accepted, rejected, or cancelled orders will appear in 'My Order History'.</p>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={closeFeedbackModal} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title style={{ fontFamily: 'Arial Black' }}>
            {feedbackType === 'accept' ? 'Accept Order' : 'Reject Order'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <p>Order: {currentOrderForFeedback?.title} (ID: {currentOrderForFeedback?._id})</p>
          <Form.Group className="mb-3">
            <Form.Label>Feedback {feedbackType === 'reject' && '(Mandatory)'}:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder={feedbackType === 'reject' ? 'Please provide a reason for rejection...' : 'Optional feedback...'}
              isInvalid={!!feedbackValidationError} // Mark as invalid if there's a validation error
              className="bg-secondary text-light rounded-md"
            />
            <Form.Control.Feedback type="invalid">
              {feedbackValidationError}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={closeFeedbackModal} className="rounded-md">
            Cancel
          </Button>
          <Button variant="primary" onClick={submitFeedback} className="rounded-md">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyOrders;
