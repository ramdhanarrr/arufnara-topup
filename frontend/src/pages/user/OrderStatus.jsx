import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function OrderStatus() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch order details
    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find(o => o.id.toString() === orderId);

        if (foundOrder) {
            setOrder(foundOrder);
            setLoading(false);
        } else {
            setError('Order not found');
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="order-status">
            <Navbar />
            <div className="content">
                <h1>Order Status</h1>

                <div className={`status-card ${order.status}`}>
                    <div className="status-header">
                        {order.status === 'paid' ? (
                            <div className="status-icon success">✓</div>
                        ) : (
                            <div className="status-icon failed">✗</div>
                        )}
                        <h2>{order.status === 'paid' ? 'Payment Successful' : 'Payment Failed'}</h2>
                    </div>

                    <div className="order-details">
                        <div className="detail-item">
                            <span>Order ID:</span>
                            <span>{order.id}</span>
                        </div>
                        <div className="detail-item">
                            <span>Package:</span>
                            <span>{order.packageName}</span>
                        </div>
                        <div className="detail-item">
                            <span>Price:</span>
                            <span>${order.price}</span>
                        </div>
                        <div className="detail-item">
                            <span>User ID:</span>
                            <span>{order.userId}</span>
                        </div>
                        <div className="detail-item">
                            <span>Server ID:</span>
                            <span>{order.serverId}</span>
                        </div>
                        <div className="detail-item">
                            <span>Status:</span>
                            <span className={`status ${order.status}`}>
                                {order.status === 'paid' ? 'Paid' : 'Failed'}
                            </span>
                        </div>

                        {order.status === 'paid' && (
                            <div className="detail-item">
                                <span>Points Added:</span>
                                <span>+{order.price} points</span>
                            </div>
                        )}
                    </div>

                    <div className="action-buttons">
                        {order.status === 'paid' ? (
                            <Link to="/" className="btn btn-primary">
                                Back to Dashboard
                            </Link>
                        ) : (
                            <Link to={`/payment/${orderId}`} className="btn btn-primary">
                                Try Again
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderStatus;