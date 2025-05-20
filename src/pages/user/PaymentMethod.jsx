import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function PaymentMethod() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Payment methods
    const paymentMethods = [
        { id: 'credit_card', name: 'Credit Card', icon: '💳' },
        { id: 'paypal', name: 'PayPal', icon: '🅿️' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
        { id: 'e_wallet', name: 'E-Wallet', icon: '📱' }
    ];

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

    const handleContinue = () => {
        if (!selectedMethod) {
            setError('Please select a payment method');
            return;
        }

        // Update order with payment method
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = orders.map(o => {
            if (o.id.toString() === orderId) {
                return { ...o, paymentMethod: selectedMethod.id };
            }
            return o;
        });

        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        // Navigate to payment process
        navigate(`/payment/${orderId}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="payment-method">
            <Navbar />
            <div className="content">
                <h1>Select Payment Method</h1>

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
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="payment-methods">
                    {paymentMethods.map(method => (
                        <div
                            key={method.id}
                            className={`payment-method-card ${selectedMethod && selectedMethod.id === method.id ? 'selected' : ''}`}
                            onClick={() => setSelectedMethod(method)}
                        >
                            <div className="method-icon">{method.icon}</div>
                            <div className="method-name">{method.name}</div>
                        </div>
                    ))}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleContinue}
                    disabled={!selectedMethod}
                >
                    Continue to Payment
                </button>
            </div>
        </div>
    );
}

export default PaymentMethod;