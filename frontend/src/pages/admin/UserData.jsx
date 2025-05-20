import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

function AdminUserData() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // In a real app, you would fetch users from an API
        // For this demo, we'll create some mock users

        // Get the current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('user'));

        // Create mock users
        const mockUsers = [
            { id: 1, email: 'user1@example.com', role: 'user', points: 150, orders: 5 },
            { id: 2, email: 'user2@example.com', role: 'user', points: 75, orders: 3 },
            { id: 3, email: 'user3@example.com', role: 'user', points: 200, orders: 8 },
            { id: 4, email: 'admin@example.com', role: 'admin', points: 0, orders: 0 }
        ];

        // Add current user if not already in the list
        if (currentUser && !mockUsers.some(u => u.email === currentUser.email)) {
            mockUsers.push({
                id: 5,
                email: currentUser.email,
                role: currentUser.role,
                points: currentUser.points || 0,
                orders: 0
            });
        }

        setUsers(mockUsers);
        setLoading(false);
    }, []);

    // Filter users by search term
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="admin-user-data">
            <Navbar />
            <div className="content">
                <h1>User Data</h1>

                <div className="search-controls">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="no-users">No users found</div>
                ) : (
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Points</th>
                                    <th>Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.points}</td>
                                        <td>{user.orders}</td>
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

export default AdminUserData;