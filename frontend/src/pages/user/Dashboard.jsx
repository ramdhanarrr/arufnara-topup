import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';

function UserDashboard() {
    const { currentUser } = useAuth();

    return (
        <div className="dashboard">
            <Navbar />
            <div className="dashboard-content">
                <h1>Welcome to Game Top-Up Store</h1>
                <div className="user-info">
                    <h2>Your Account</h2>
                    <p>Email: {currentUser.email}</p>
                    <p>Points: {currentUser.points || 0}</p>
                </div>

                <div className="action-cards">
                    <div className="card">
                        <h3>Top Up Game Credits</h3>
                        <p>Purchase game credits for your favorite games</p>
                        <Link to="/top-up" className="btn btn-primary">View Top-Up Options</Link>
                    </div>

                    <div className="card">
                        <h3>Transaction History</h3>
                        <p>View your past transactions and orders</p>
                        <Link to="/transactions" className="btn btn-secondary">View History</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;