import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';

function TopUpOptions() {
    // Mock game data
    const games = [
        { id: 1, name: 'Mobile Legends', image: '/images/ml.jpg' },
        { id: 2, name: 'PUBG Mobile', image: '/images/pubg.jpg' },
        { id: 3, name: 'Free Fire', image: '/images/freefire.jpg' },
        { id: 4, name: 'Genshin Impact', image: '/images/genshin.jpg' }
    ];

    return (
        <div className="top-up-options">
            <Navbar />
            <div className="content">
                <h1>Select Game for Top-Up</h1>

                <div className="games-grid">
                    {games.map(game => (
                        <Link to={`/top-up/${game.id}`} key={game.id} className="game-card">
                            <div className="game-image">
                                <img src={game.image || "/placeholder.svg"} alt={game.name} onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150';
                                }} />
                            </div>
                            <div className="game-name">{game.name}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TopUpOptions;