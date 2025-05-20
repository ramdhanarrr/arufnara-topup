import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function TopUpForm() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [userId, setUserId] = useState('');
    const [serverId, setServerId] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Mock packages data
    const packages = [
        { id: 1, name: '50 Diamonds', price: 10 },
        { id: 2, name: '100 Diamonds', price: 20 },
        { id: 3, name: '300 Diamonds', price: 50 },
        { id: 4, name: '500 Diamonds', price: 80 },
        { id: 5, name: '1000 Diamonds', price: 150 }
    ];

    // Mock function to fetch game details
    useEffect(() => {
        // In a real app, you would fetch this from an API
        const gameData = {
            1: { id: 1, name: 'Mobile Legends', image: '/images/ml.jpg' },
            2: { id: 2, name: 'PUBG Mobile', image: '/images/pubg.jpg' },
            3: { id: 3, name: 'Free Fire', image: '/images/freefire.jpg' },
            4: { id: 4, name: 'Genshin Impact', image: '/images/genshin.jpg' }
        };

        setTimeout(() => {
            if (gameData[gameId]) {
                setGame(gameData[gameId]);
                setLoading(false);
            } else {
                setError('Game not found');
                setLoading(false);
            }
        }, 500); // Simulate API delay
    }, [gameId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userId || !serverId || !selectedPackage) {
            setError('Please fill in all fields and select a package');
            return;
        }

        // Create a mock order
        const order = {
            id: Date.now(),
            gameId,
            userId,
            serverId,
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            price: selectedPackage.price,
            status: 'pending'
        };

        // In a real app, you would send this to your backend
        // For now, we'll store it in localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Navigate to payment method selection
        navigate(`/payment-method/${order.id}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="top-up-form">
            <Navbar />
            <div className="content">
                <h1>Top Up {game.name}</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="user-id">User ID</label>
                        <input
                            type="text"
                            id="user-id"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter your game user ID"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="server-id">Server ID</label>
                        <input
                            type="text"
                            id="server-id"
                            value={serverId}
                            onChange={(e) => setServerId(e.target.value)}
                            placeholder="Enter your game server ID"
                            required
                        />
                    </div>

                    <div className="package-selection">
                        <h3>Select Package</h3>
                        <div className="packages-grid">
                            {packages.map(pkg => (
                                <div
                                    key={pkg.id}
                                    className={`package-card ${selectedPackage && selectedPackage.id === pkg.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedPackage(pkg)}
                                >
                                    <div className="package-name">{pkg.name}</div>
                                    <div className="package-price">${pkg.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TopUpForm;