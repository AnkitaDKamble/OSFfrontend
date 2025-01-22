import React, { useState, useEffect } from 'react';

function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setError(errorResult.message || 'Failed to fetch orders');
        return;
      }

      const result = await response.json();
      setOrders(result.orders);
    } catch (err) {
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    setUpdatedStatuses((prevState) => ({
      ...prevState,
      [orderId]: newStatus,
    }));
  };

  // Submit updated statuses
  const handleSubmit = async () => {
    try {
      debugger
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Loop through all updated statuses and create the request body
      const statusUpdates = Object.entries(updatedStatuses).map(([orderId, newStatus]) => ({
        orderId,
        status: newStatus,
      }));

      // Make sure there's at least one status to update
      if (statusUpdates.length === 0) {
        setError('No status updates to submit');
        return;
      }

      // Send the update request
      const response = await fetch('http://localhost:5000/api/orders/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure the token is included in the request
        },
        body: JSON.stringify({ statusUpdates }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage('Order statuses updated successfully.');
        fetchOrders(); // Re-fetch orders to reflect status changes
      } else {
        setError(result.message || 'Failed to update order statuses');
      }
    } catch (err) {
      setError('An error occurred while updating order statuses.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <h2>Manage Orders</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Length (ft)</th>
                <th>Width (ft)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.title}</td> {/* Display order title */}
                    <td>₹{order.orderAmount}</td>
                    <td>{order.length}</td> {/* Display order length */}
                    <td>{order.width}</td> {/* Display order width */}
                    <td>{order.status}</td>
                    <td>
                      <select
                        className="form-select"
                        value={updatedStatuses[order._id] || order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="manufacturing started">Manufacturing Started</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No orders available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Submit Button */}
          <button onClick={handleSubmit} className="btn btn-primary">
            Submit Updated Statuses
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDashboard;
