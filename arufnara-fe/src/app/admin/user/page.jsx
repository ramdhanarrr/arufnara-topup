'use client';

import React, { useState, useEffect } from "react";
import API from "../../../_api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await API.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Cek berbagai kemungkinan struktur response
        let userData = response.data;
        
        // Jika response berupa { data: [...] }
        if (userData && userData.data && Array.isArray(userData.data)) {
          userData = userData.data;
        }
        // Jika response berupa { users: [...] }
        else if (userData && userData.users && Array.isArray(userData.users)) {
          userData = userData.users;
        }
        // Jika response berupa { result: [...] }
        else if (userData && userData.result && Array.isArray(userData.result)) {
          userData = userData.result;
        }
        // Jika response berupa { success: true, data: [...] }
        else if (userData && userData.success && userData.data) {
          userData = userData.data;
        }
        
        setUsers(Array.isArray(userData) ? userData : []);
        setError(null);
      } catch (err) {
        setError(`Gagal mengambil data pengguna: ${err.message}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    // Implementasi edit user
    console.log("Edit user:", userId);
  };

  const handleDelete = (userId) => {
    // Implementasi delete user
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      console.log("Delete user:", userId);
      // Tambahkan logika delete di sini
    }
  };

  if (loading) {
    return (
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-4">User Table</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Table</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table id="userTable" className="display min-w-full border rounded-lg shadow-md">
          <thead className="bg-green-100 text-left">
            <tr>
              <th className="p-3">Id</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Password</th>
              <th className="p-3">User Point</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name || user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">********</td>
                  <td className="p-3">{user.point || 0}</td>
                  <td className="p-3 space-x-2">
                    <button 
                      onClick={() => handleEdit(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  {error ? "Tidak dapat memuat data pengguna" : "Tidak ada data pengguna"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}