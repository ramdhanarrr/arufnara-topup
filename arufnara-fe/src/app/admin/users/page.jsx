'use client';

import React, { useState, useEffect } from "react";
import API from "../../../_api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
      } catch (err) {
        setError("Gagal mengambil data pengguna!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Table</h2>
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
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">********</td>
                <td className="p-3">{user.point}</td>
                <td className="p-3 space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
