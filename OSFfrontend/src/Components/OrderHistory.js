import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import './OrderHistory.css';

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch customer's order history
  const fetchOrderHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to be logged in to view your order history.');
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
        setError(result.message || `Failed to fetch your order history: ${response.statusText}`);
        setLoading(false);
        return;
      }

      if (Array.isArray(result.orders)) {
        const filteredOrders = result.orders.filter(
          (order) => order.status === 'accepted' || order.status === 'cancelled'
        );
        setOrderHistory(filteredOrders);
      } else {
        setError('Unexpected data format for your order history from server.');
        setOrderHistory([]);
      }
    } catch (err) {
      console.error('Network error fetching customer order history:', err);
      setError('An unexpected network error occurred while fetching your order history. Please check your connection.');
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Helper function for status badge
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'status-badge status-history-accepted';
      case 'cancelled':
        return 'status-badge status-history-cancelled';
      default:
        return 'status-badge status-history-default';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="orderhistory-container">
      <div className="orderhistory-header">
        <h2 className="orderhistory-title">
          <i className="bi bi-clock-history me-3"></i>
          My Order History
        </h2>
        <div className="title-underline"></div>
        <p className="orderhistory-subtitle">View your accepted and cancelled orders</p>
      </div>

      {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="warning" role="status">
            <span className="visually-hidden">Loading your order history...</span>
          </Spinner>
          <p className="mt-2">Loading your order history...</p>
        </div>
      ) : (
        <div className="orderhistory-content">
          {orderHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="orderhistory-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Your Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">{order._id.slice(-8)}</td>
                      <td className="order-title">{order.title}</td>
                      <td className="order-amount">₹{order.orderAmount}</td>
                      <td>
                        <span className={getStatusBadgeClass(order.status)}>
                          <i className={`me-1 ${order.status === 'accepted' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'}`}></i>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="order-feedback">{order.feedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-inbox display-1"></i>
              <p>No accepted or cancelled orders in your history</p>
              <p className="text-muted small">Orders you accept or cancel will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;