import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
    setLoading(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id.toString() === orderId.toString()) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // If status changed to paid, update user points
    if (newStatus === 'paid') {
      const order = orders.find(o => o.id.toString() === orderId.toString());
      if (order) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(user => {
          if (user.id === order.userId) {
            return {
              ...user,
              points: (user.points || 0) + order.price
            };
          }
          return user;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-orders">
      <Navbar />
      <div className="content">
        <h1>Manage Orders</h1>
        
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Server ID</th>
                  <th>Package</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{order.serverId}</td>
                    <td>{order.packageName}</td>
                    <td>${order.price}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;