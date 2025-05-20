import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Game Top-Up Store</Link>
            </div>

            <div className="navbar-menu">
                {currentUser && (
                    <>
                        {currentUser.role === 'admin' ? (
                            <>
                                <Link to="/admin" className="navbar-item">Dashboard</Link>
                                <Link to="/admin/orders" className="navbar-item">Orders</Link>
                                <Link to="/admin/transactions" className="navbar-item">Transactions</Link>
                                <Link to="/admin/users" className="navbar-item">Users</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="navbar-item">Dashboard</Link>
                                <Link to="/top-up" className="navbar-item">Top-Up</Link>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="navbar-end">
                {currentUser ? (
                    <div className="user-menu">
                        <span className="user-email">{currentUser.email}</span>
                        {currentUser.role === 'user' && (
                            <span className="user-points">{currentUser.points || 0} Points</span>
                        )}
                        <button className="btn btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="btn btn-login">Login</Link>
                        <Link to="/register" className="btn btn-register">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;