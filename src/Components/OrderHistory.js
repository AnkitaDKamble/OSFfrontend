import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Table } from 'react-bootstrap';

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch customer's order history
  const fetchOrderHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token'); // Get customer's token
      if (!token) {
        setError('You need to be logged in to view your order history.');
        setLoading(false);
        return;
      }

      // Fetch orders from the /api/my-orders endpoint
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
        // --- CRUCIAL CHANGE: Filter for orders that are 'accepted' OR 'cancelled' ---
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Order History</h2> {/* Title adjusted as it now includes cancelled */}

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading your order history...</span>
          </Spinner>
          <p className="mt-2">Loading your order history...</p>
        </div>
      ) : (
        <div>
          {orderHistory.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover responsive className="table-dark rounded overflow-hidden">
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
                      <td>{order._id}</td>
                      <td>{order.title}</td>
                      <td>₹{order.orderAmount}</td>
                      <td>
                        <span className={`badge ${
                            order.status === 'accepted' ? 'bg-success' : // Accepted by customer
                            order.status === 'cancelled' ? 'bg-danger' : // Cancelled
                            'bg-secondary' // Default fallback, though should be covered
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
            <p className="text-center text-muted">No accepted or cancelled orders in your history.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
