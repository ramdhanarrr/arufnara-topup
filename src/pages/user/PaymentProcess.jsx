import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function PaymentProcess() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('processing');
    const [countdown, setCountdown] = useState(5);

    // Fetch order details
    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = orders.find(o => o.id.toString() === orderId);

        if (foundOrder) {
            setOrder(foundOrder);
            setLoading(false);

            // Simulate payment processing
            const timer = setTimeout(() => {
                // 80% chance of success for demo purposes
                const success = Math.random() < 0.8;

                if (success) {
                    setPaymentStatus('success');

                    // Update order status
                    const updatedOrders = orders.map(o => {
                        if (o.id.toString() === orderId) {
                            return { ...o, status: 'paid' };
                        }
                        return o;
                    });

                    localStorage.setItem('orders', JSON.stringify(updatedOrders));

                    // Update user points
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user) {
                        const updatedUser = {
                            ...user,
                            points: (user.points || 0) + foundOrder.price
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }

                    // Start countdown to redirect
                    const countdownInterval = setInterval(() => {
                        setCountdown(prev => {
                            if (prev <= 1) {
                                clearInterval(countdownInterval);
                                navigate(`/order-status/${orderId}`);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                } else {
                    setPaymentStatus('failed');

                    // Update order status
                    const updatedOrders = orders.map(o => {
                        if (o.id.toString() === orderId) {
                            return { ...o, status: 'failed' };
                        }
                        return o;
                    });

                    localStorage.setItem('orders', JSON.stringify(updatedOrders));
                }
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setError('Order not found');
            setLoading(false);
        }
    }, [orderId, navigate]);

    const handleTryAgain = () => {
        setPaymentStatus('processing');

        // Simulate payment processing again
        setTimeout(() => {
            // 80% chance of success for demo purposes
            const success = Math.random() < 0.8;

            if (success) {
                setPaymentStatus('success');

                // Update order status
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const updatedOrders = orders.map(o => {
                    if (o.id.toString() === orderId) {
                        return { ...o, status: 'paid' };
                    }
                    return o;
                });

                localStorage.setItem('orders', JSON.stringify(updatedOrders));

                // Update user points
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    const updatedUser = {
                        ...user,
                        points: (user.points || 0) + order.price
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }

                // Start countdown to redirect
                const countdownInterval = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            navigate(`/order-status/${orderId}`);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setPaymentStatus('failed');

                // Update order status
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const updatedOrders = orders.map(o => {
                    if (o.id.toString() === orderId) {
                        return { ...o, status: 'failed' };
                    }
                    return o;
                });

                localStorage.setItem('orders', JSON.stringify(updatedOrders));
            }
        }, 3000);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="payment-process">
            <Navbar />
            <div className="content">
                <h1>Payment Processing</h1>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-item">
                        <span>Package:</span>
                        <span>{order.packageName}</span>
                    </div>
                    <div className="summary-item">
                        <span>Price:</span>
                        <span>${order.price}</span>
                    </div>
                    <div className="summary-item">
                        <span>Payment Method:</span>
                        <span>{order.paymentMethod}</span>
                    </div>
                </div>

                <div className={`payment-status ${paymentStatus}`}>
                    {paymentStatus === 'processing' && (
                        <>
                            <div className="spinner"></div>
                            <p>Processing your payment...</p>
                        </>
                    )}

                    {paymentStatus === 'success' && (
                        <>
                            <div className="success-icon">✓</div>
                            <p>Payment Successful!</p>
                            <p>Redirecting to order status in {countdown} seconds...</p>
                        </>
                    )}

                    {paymentStatus === 'failed' && (
                        <>
                            <div className="failed-icon">✗</div>
                            <p>Payment Failed</p>
                            <p>There was an issue processing your payment.</p>
                            <button className="btn btn-primary" onClick={handleTryAgain}>
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentProcess;