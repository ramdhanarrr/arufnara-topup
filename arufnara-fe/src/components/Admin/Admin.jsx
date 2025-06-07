// components/admin/Admin.jsx
import React from 'react';

const Admin = ({ children }) => {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">Admin Control</header>
      <div className="flex">
        <aside className="w-64 bg-gray-200 min-h-screen p-4">
          <nav>
            <ul className="space-y-2">
              <li><a href="/admin">Dashboard</a></li>
              <li><a href="/admin/database">DataBase</a></li>
              <li><a href="/admin/topup">Top Up</a></li>
              <li><a href="/admin/payment">Payment</a></li>
              <li><a href="/admin/point">Point</a></li>
              <li><a href="/admin/user">User</a></li>
              <li><a href="/admin/order">Order</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Admin;
