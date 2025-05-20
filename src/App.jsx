import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/user/Dashboard';
import TopUpOptions from './pages/user/TopUpOptions';
import TopUpForm from './pages/user/TopUpForm';
import PaymentMethod from './pages/user/PaymentMethod';
import PaymentProcess from './pages/user/PaymentProcess';
import OrderStatus from './pages/user/OrderStatus';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminTransactions from './pages/admin/Transactions';
import AdminUserData from './pages/admin/UserData';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/top-up" element={
              <ProtectedRoute>
                <TopUpOptions />
              </ProtectedRoute>
            } />
            <Route path="/top-up/:gameId" element={
              <ProtectedRoute>
                <TopUpForm />
              </ProtectedRoute>
            } />
            <Route path="/payment-method/:orderId" element={
              <ProtectedRoute>
                <PaymentMethod />
              </ProtectedRoute>
            } />
            <Route path="/payment/:orderId" element={
              <ProtectedRoute>
                <PaymentProcess />
              </ProtectedRoute>
            } />
            <Route path="/order-status/:orderId" element={
              <ProtectedRoute>
                <OrderStatus />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
              <ProtectedRoute requiredRole="admin">
                <AdminTransactions />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUserData />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;