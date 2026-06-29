import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import './OrderHistoryDashboard.css';

function OrderHistoryDashboard() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch orders for the admin's history dashboard
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in as admin.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
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
        setError(result.message || `Failed to fetch orders: ${response.statusText}`);
        setLoading(false);
        return;
      }

      if (Array.isArray(result.orders)) {
        const filteredOrders = result.orders.filter(
          (order) => order.status === 'accepted' || order.status === 'cancelled'
        );
        setOrderHistory(filteredOrders);
      } else {
        setError('Unexpected data format for orders from server.');
        setOrderHistory([]);
      }
    } catch (err) {
      console.error('Network error fetching order history:', err);
      setError('An unexpected network error occurred while fetching order history. Please check your connection.');
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
    <div className="orderhistorydashboard-container">
      <div className="orderhistorydashboard-header">
        <h2 className="orderhistorydashboard-title">
          <i className="bi bi-clock-history me-3"></i>
          Order History Dashboard
        </h2>
        <div className="title-underline"></div>
        <p className="orderhistorydashboard-subtitle">View accepted and cancelled orders</p>
      </div>

      {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="warning" role="status">
            <span className="visually-hidden">Loading order history...</span>
          </Spinner>
          <p className="mt-2">Loading order history...</p>
        </div>
      ) : (
        <div className="orderhistorydashboard-content">
          {orderHistory.length > 0 ? (
            <div className="table-responsive">
              <table className="orderhistorydashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Customer Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">{order._id.slice(-8)}</td>
                      <td className="customer-name">{order.userId ? order.userId.username : 'N/A'}</td>
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
              <p>No accepted or cancelled orders in history</p>
              <p className="text-muted small">Orders accepted or cancelled by customers will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryDashboard;