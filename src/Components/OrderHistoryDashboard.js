import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Table } from 'react-bootstrap';

// Component name
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
        // --- CRUCIAL CHANGE: Filter for orders that are 'accepted' by customer OR 'cancelled' ---
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
      setOrderHistory([]); // Ensure it's an empty array on network error too
    } finally {
      setLoading(false);
    }
  };

  // Call the data fetching function inside useEffect
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Order History (Accepted & Cancelled Orders)</h2> {/* Title updated */}

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading order history...</span>
          </Spinner>
          <p className="mt-2">Loading order history...</p>
        </div>
      ) : (
        <div>
          {orderHistory.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover responsive className="table-dark rounded overflow-hidden">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Status</th> {/* Will be 'Accepted' or 'Cancelled' here */}
                    <th>Customer Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.userId ? order.userId.username : 'N/A'}</td>
                      <td>{order.title}</td>
                      <td>₹{order.orderAmount}</td>
                      <td>
                        <span className={`badge ${
                            order.status === 'accepted' ? 'bg-success' : // Accepted by customer
                            order.status === 'cancelled' ? 'bg-danger' : // Cancelled
                            'bg-secondary' // Fallback for any other unexpected status
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>{order.feedback || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted">No accepted or cancelled orders in history.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryDashboard;
