import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    // In a real app, transactions would be separate from orders
    // For this demo, we'll use orders as transactions
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Convert orders to transactions format
    const transactionsData = orders.map(order => ({
      id: `TRX-${order.id}`,
      orderId: order.id,
      amount: order.price,
      status: order.status,
      paymentMethod: order.paymentMethod || 'Unknown',
      date: new Date(order.id).toISOString() // Using order ID as timestamp for demo
    }));
    
    setTransactions(transactionsData);
    setLoading(false);
  }, []);

  // Filter transactions by date
  const filteredTransactions = transactions.filter(transaction => {
    if (dateFilter === 'all') return true;
    
    const txDate = new Date(transaction.date);
    const today = new Date();
    
    if (dateFilter === 'today') {
      return txDate.toDateString() === today.toDateString();
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return txDate >= weekAgo;
    }
    
    if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      return txDate >= monthAgo;
    }
    
    return true;
  });

  // Calculate total revenue
  const totalRevenue = filteredTransactions
    .filter(tx => tx.status === 'paid')
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-transactions">
      <Navbar />
      <div className="content">
        <h1>Manage Transactions</h1>
        
        <div className="filter-controls">
          <label htmlFor="date-filter">Filter by Date:</label>
          <select 
            id="date-filter" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div className="revenue-summary">
          <h3>Total Revenue: ${totalRevenue}</h3>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">No transactions found</div>
        ) : (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{transaction.orderId}</td>
                    <td>${transaction.amount}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
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

export default AdminTransactions;