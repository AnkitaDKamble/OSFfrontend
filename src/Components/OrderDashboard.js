import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Button, Form, Table } from 'react-bootstrap'; // Import Table for table styling

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages
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
        // --- CRUCIAL CHANGE: Filter to EXCLUDE ONLY orders 'accepted' by the customer ---
        const activeManagementOrders = result.orders.filter(
          (order) => order.status !== 'accepted' // Only exclude customer-accepted orders
        );
        setOrders(activeManagementOrders);

        // Initialize updatedStatuses for the filtered orders
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
          // Only include orders where status has actually changed from their original
          const originalOrder = orders.find(order => order._id === orderId);
          return originalOrder && originalOrder.status !== newStatus;
        })
        .map(([orderId, newStatus]) => ({
          orderId,
          status: newStatus,
        }));

      if (statusUpdates.length === 0) {
        setError('No status updates to submit.');
        return;
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
        setUpdatedStatuses({}); // Clear updated statuses after successful submission
        fetchOrders(); // Re-fetch all orders to reflect status changes (which will re-filter them)
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Active Orders (Admin Dashboard)</h2> {/* Clarified title */}

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

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
              <Table striped bordered hover responsive className="table-dark rounded overflow-hidden">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Length (ft)</th>
                    <th>Width (ft)</th>
                    <th>Current Status</th>
                    <th>New Status</th>
                    <th>Customer Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.userId ? order.userId.username : 'N/A'}</td>
                      <td>{order.title}</td>
                      <td>₹{order.orderAmount}</td>
                      <td>{order.length}</td>
                      <td>{order.width}</td>
                      <td>
                        <span className={`badge ${
                            order.status === 'pending' ? 'bg-info' :
                            order.status === 'acceptedbyadmin' ? 'bg-primary' : // Admin accepted, differentiating from customer accepted
                            order.status === 'manufacturing started' ? 'bg-warning text-dark' :
                            order.status === 'completed' ? 'bg-secondary' :
                            order.status === 'delivered' ? 'bg-success' : // Delivered (awaiting customer review)
                            order.status === 'cancelled' ? 'bg-danger' :
                            order.status === 'rejected' ? 'bg-danger' : // Rejected by customer
                            'bg-light text-dark' // Default/fallback
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <Form.Select
                          className="bg-secondary text-light rounded-md"
                          value={updatedStatuses[order._id] || order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          aria-label={`Select status for order ${order._id}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="acceptedbyadmin">Accepted by Admin</option> {/* Renamed for clarity */}
                          <option value="manufacturing started">Manufacturing Started</option>
                          <option value="completed">Completed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="rejected">Rejected</option> {/* Included 'rejected' in dropdown as requested */}
                        </Form.Select>
                      </td>
                      <td>{order.feedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-end mt-3">
                <Button onClick={handleSubmit} className="btn btn-primary rounded-md">
                  Submit All Updated Statuses
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">No active orders available for management. Customer Accepted orders are in Order History.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderDashboard;
