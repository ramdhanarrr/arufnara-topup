// app/admin/user.jsx
import React from "react";

const AdminUser = () => {
  return (
    <section>
        <h2 className="text-xl font-semibold mb-4">User Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md">
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
              <tr className="border-t">
                <td className="p-3">1</td>
                <td className="p-3">johndoe</td>
                <td className="p-3">johndoe@example.com</td>
                <td className="p-3">********</td>
                <td className="p-3">150</td>
                <td className="p-3 space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
              {/* Tambah data lainnya di sini */}
            </tbody>
          </table>
        </div>
      </section>
  );
};

export default AdminUser;
