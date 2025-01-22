import React, { useState, useEffect } from 'react';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/my-orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setError(errorResult.message || 'Failed to fetch orders');
        setLoading(false);
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

  // Cancel order
  const cancelOrder = async (orderId) => {
    debugger
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
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

      // Refresh orders after cancellation
      fetchOrders();
    } catch (err) {
      setError('An error occurred while cancelling order.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.title}</td>
                    <td>₹{order.orderAmount}</td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === 'pending' && (
                        <button
                          className="btn btn-danger"
                          onClick={() => cancelOrder(order._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No orders available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
