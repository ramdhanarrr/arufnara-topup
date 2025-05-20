import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';

function AdminDashboard() {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        failedOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        // Calculate stats from orders
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');

        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.status === 'paid').length;
        const failedOrders = orders.filter(o => o.status === 'failed').length;
        const totalRevenue = orders
            .filter(o => o.status === 'paid')
            .reduce((sum, order) => sum + order.price, 0);

        setStats({
            totalOrders,
            completedOrders,
            failedOrders,
            totalRevenue
        });
    }, []);

    return (
        <div className="admin-dashboard">
            <Navbar />
            <div className="content">
                <h1>Admin Dashboard</h1>

                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <div className="stat-value">{stats.totalOrders}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Completed Orders</h3>
                        <div className="stat-value">{stats.completedOrders}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Failed Orders</h3>
                        <div className="stat-value">{stats.failedOrders}</div>
                    </div>

                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">${stats.totalRevenue}</div>
                    </div>
                </div>

                <div className="admin-actions">
                    <div className="action-card">
                        <h3>Manage Orders</h3>
                        <p>View and manage customer orders</p>
                        <Link to="/admin/orders" className="btn btn-primary">View Orders</Link>
                    </div>

                    <div className="action-card">
                        <h3>Manage Transactions</h3>
                        <p>View and manage payment transactions</p>
                        <Link to="/admin/transactions" className="btn btn-primary">View Transactions</Link>
                    </div>

                    <div className="action-card">
                        <h3>User Data</h3>
                        <p>View user information and points</p>
                        <Link to="/admin/users" className="btn btn-primary">View Users</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;