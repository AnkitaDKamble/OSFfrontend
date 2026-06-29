import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Button, Form, Table } from 'react-bootstrap';
import './OrderDashboard.css';

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
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
        const activeManagementOrders = result.orders.filter(
          (order) => order.status !== 'accepted'
        );
        setOrders(activeManagementOrders);

        const initialStatuses = {};
        activeManagementOrders.forEach(order => {
          initialStatuses[order._id] = order.status;
        });
        setUpdatedStatuses(initialStatuses);
      } else {
        setError('Unexpected data format for orders from server.');
        setOrders([]);
      }
    } catch (err) {
      console.error('Network error fetching orders:', err);
      setError('An unexpected network error occurred while fetching orders. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle status change in the dropdown
  const handleStatusChange = (orderId, newStatus) => {
    setUpdatedStatuses((prevState) => ({
      ...prevState,
      [orderId]: newStatus,
    }));
  };

  // Submit updated statuses
  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in as admin.');
        return;
      }

      const statusUpdates = Object.entries(updatedStatuses)
        .filter(([orderId, newStatus]) => {
          const originalOrder = orders.find(order => order._id === orderId);
          return originalOrder && originalOrder.status !== newStatus;
        })
        .map(([orderId, newStatus]) => ({
          orderId,
          status: newStatus,
        }));

      // ✅ REMOVED: No alert when no status updates
      // Just return silently without showing error
      if (statusUpdates.length === 0) {
        return; // Silently exit without any alert
      }

      const response = await fetch('http://localhost:5000/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statusUpdates }),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error for status update:', jsonError);
        setError(`Server responded with non-JSON data or empty response during status update: ${response.status} ${response.statusText}`);
        return;
      }

      if (response.ok) {
        setSuccessMessage('Order statuses updated successfully.');
        setUpdatedStatuses({});
        fetchOrders();
      } else {
        setError(result.message || 'Failed to update order statuses');
      }
    } catch (err) {
      console.error('Network error submitting status updates:', err);
      setError('An unexpected network error occurred while updating order statuses.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper function to get badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-dark';
      case 'confirmed':
        return 'bg-info text-dark';
      case 'processing':
        return 'bg-primary';
      case 'shipped':
        return 'bg-secondary';
      case 'delivered':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'accepted':
        return 'bg-dark';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-light text-dark';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          <i className="bi bi-speedometer2 me-3"></i>
          Manage Active Orders
        </h2>
        <div className="title-underline"></div>
        <p className="dashboard-subtitle">Track and update order statuses</p>
      </div>

      {error && <Alert variant="danger" className="custom-alert">{error}</Alert>}
      {successMessage && <Alert variant="success" className="custom-alert">{successMessage}</Alert>}

      {loading ? (
        <div className="text-center loading-container">
          <Spinner animation="border" variant="warning" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </Spinner>
          <p className="mt-2 text-muted">Loading orders...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Length (ft)</th>
                    <th>Width (ft)</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                    <th>Customer Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="order-id">{order._id.slice(-8)}</td>
                      <td>{order.userId ? order.userId.username : 'N/A'}</td>
                      <td>{order.title}</td>
                      <td className="amount">₹{order.orderAmount}</td>
                      <td>{order.length} ft</td>
                      <td>{order.width} ft</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={updatedStatuses[order._id] || order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="feedback">{order.feedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="submit-container">
                <button onClick={handleSubmit} className="submit-btn">
                  <i className="bi bi-check2-circle me-2"></i>
                  Update Statuses
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bi bi-inbox display-1"></i>
              <p>No active orders available for management.</p>
              <p className="text-muted small">Customer accepted orders are moved to history</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderDashboard;