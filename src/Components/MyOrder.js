import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import './MyOrder.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentOrderForFeedback, setCurrentOrderForFeedback] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackValidationError, setFeedbackValidationError] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    setActionSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
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
        const activeOrders = result.orders.filter(
          (order) =>
            order.status !== 'accepted' &&
            order.status !== 'rejected' &&
            order.status !== 'cancelled'
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

  // Cancel order
  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    setError('');
    setActionSuccessMessage('');
    setShowCancelConfirm(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/orders/${orderToCancel}/cancel`, {
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
      fetchOrders();
      setOrderToCancel(null);
    } catch (err) {
      console.error('Network error cancelling order:', err);
      setError('An error occurred while cancelling order.');
    }
  };

  // Open feedback modal
  const openFeedbackModal = (order, type) => {
    setCurrentOrderForFeedback(order);
    setFeedbackType(type);
    setFeedbackMessage(order.feedback || '');
    setFeedbackValidationError('');
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

  // Submit feedback
  const submitFeedback = async () => {
    setError('');
    setActionSuccessMessage('');
    setFeedbackValidationError('');

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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: feedbackType,
          feedback: feedbackMessage.trim(),
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setError(errorResult.message || `Failed to ${feedbackType} order.`);
        closeFeedbackModal();
        return;
      }

      const successMsg = feedbackType === 'accept' ? 'Order accepted successfully!' : 'Order rejected successfully!';
      setActionSuccessMessage(successMsg);
      fetchOrders();
      closeFeedbackModal();
    } catch (err) {
      console.error('Network error submitting feedback:', err);
      setError('An error occurred while submitting feedback.');
      closeFeedbackModal();
    }
  };

  // Helper function for status badge
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'confirmed':
        return 'status-badge status-confirmed';
      case 'processing':
        return 'status-badge status-processing';
      case 'shipped':
        return 'status-badge status-shipped';
      case 'delivered':
        return 'status-badge status-delivered';
      case 'cancelled':
        return 'status-badge status-cancelled';
      case 'accepted':
        return 'status-badge status-accepted';
      case 'rejected':
        return 'status-badge status-rejected';
      default:
        return 'status-badge status-default';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="myorders-container">
      <div className="myorders-header">
        <h2 className="myorders-title">
          <i className="bi bi-cart-check me-3"></i>
          My Active Orders
        </h2>
        <div className="title-underline"></div>
        <p className="myorders-subtitle">Track and manage your orders</p>
      </div>

      {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}
      {actionSuccessMessage && <Alert variant="success" className="custom-alert">{actionSuccessMessage}</Alert>}

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="warning" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </Spinner>
          <p className="mt-2">Loading your orders...</p>
        </div>
      ) : (
        <div className="myorders-content">
          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="myorders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Feedback</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">{order._id.slice(-8)}</td>
                      <td className="order-title">{order.title}</td>
                      <td className="order-amount">₹{order.orderAmount}</td>
                      <td>
                        <span className={getStatusBadgeClass(order.status)}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="order-feedback">{order.feedback || '-'}</td>
                      <td className="order-actions">
                        {order.status === 'pending' && (
                          <button
                            className="action-btn action-cancel"
                            onClick={() => {
                              setOrderToCancel(order._id);
                              setShowCancelConfirm(true);
                            }}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancel
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <div className="action-group">
                            <button
                              className="action-btn action-accept"
                              onClick={() => openFeedbackModal(order, 'accept')}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Accept
                            </button>
                            <button
                              className="action-btn action-reject"
                              onClick={() => openFeedbackModal(order, 'reject')}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Reject
                            </button>
                          </div>
                        )}
                        {(order.status === 'processing' || order.status === 'shipped' || order.status === 'confirmed') && (
                          <span className="status-badge status-processing-small">
                            <i className="bi bi-clock-history me-1"></i>
                            In Progress
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-inbox display-1"></i>
              <p>No active orders available</p>
              <p className="text-muted small">Your accepted, rejected, or cancelled orders will appear in Order History</p>
            </div>
          )}
        </div>
      )}

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={closeFeedbackModal} centered className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>
            {feedbackType === 'accept' ? (
              <><i className="bi bi-check-circle-fill me-2"></i>Accept Order</>
            ) : (
              <><i className="bi bi-x-circle-fill me-2"></i>Reject Order</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <div className="order-info">
            <p><strong>Order:</strong> {currentOrderForFeedback?.title}</p>
            <p><strong>ID:</strong> {currentOrderForFeedback?._id?.slice(-8)}</p>
          </div>
          <Form.Group className="feedback-form-group">
            <Form.Label>
              {feedbackType === 'reject' ? (
                <><i className="bi bi-chat-text-fill me-2"></i>Feedback <span className="required">*</span></>
              ) : (
                <><i className="bi bi-chat-text-fill me-2"></i>Feedback (Optional)</>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              placeholder={feedbackType === 'reject' 
                ? "Please provide a reason for rejection..." 
                : "Share your experience with this order..."}
              isInvalid={!!feedbackValidationError}
              className="feedback-textarea"
            />
            <Form.Control.Feedback type="invalid">
              {feedbackValidationError}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <button className="modal-btn modal-cancel" onClick={closeFeedbackModal}>
            <i className="bi bi-arrow-left me-2"></i>
            Cancel
          </button>
          <button className="modal-btn modal-submit" onClick={submitFeedback}>
            <i className="bi bi-send me-2"></i>
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal show={showCancelConfirm} onHide={() => setShowCancelConfirm(false)} centered className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirm Cancellation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body text-center">
          <i className="bi bi-question-circle display-1 text-warning mb-3 d-block"></i>
          <p>Are you sure you want to cancel this order?</p>
          <p className="text-muted small">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <button className="modal-btn modal-cancel" onClick={() => setShowCancelConfirm(false)}>
            <i className="bi bi-arrow-left me-2"></i>
            No, Go Back
          </button>
          <button className="modal-btn modal-danger" onClick={handleCancelOrder}>
            <i className="bi bi-trash me-2"></i>
            Yes, Cancel Order
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyOrders;