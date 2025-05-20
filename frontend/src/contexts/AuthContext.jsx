import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in from localStorage on initial load
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (email, password) => {
        // In a real app, you would validate with a backend
        // This is just a mock implementation
        return new Promise((resolve, reject) => {
            // Mock users for demo
            const users = [
                { id: 1, email: 'user@example.com', password: 'password', role: 'user', points: 0 },
                { id: 2, email: 'admin@example.com', password: 'password', role: 'admin' }
            ];

            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Remove password before storing
                const { password, ...userWithoutPassword } = user;
                setCurrentUser(userWithoutPassword);
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
                resolve(userWithoutPassword);
            } else {
                reject(new Error('Invalid email or password'));
            }
        });
    };

    // Register function
    const register = (email, password) => {
        // In a real app, you would send this to a backend
        return new Promise((resolve, reject) => {
            // Check if email is already used
            const existingUser = localStorage.getItem('user');
            if (existingUser && JSON.parse(existingUser).email === email) {
                reject(new Error('Email already in use'));
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(), // Mock ID
                email,
                role: 'user',
                points: 0
            };

            setCurrentUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            resolve(newUser);
        });
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        currentUser,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}