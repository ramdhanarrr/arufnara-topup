// app/admin/order.jsx
import React from "react";

const AdminOrder = () => {
  return (
    <section>
        <h2 className="text-xl font-semibold mb-4">Transaksi Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-3">Id</th>
                <th className="p-3">Topup Option</th>
                <th className="p-3">Jumlah Topup</th>
                <th className="p-3">Id User</th>
                <th className="p-3">ML User ID</th>
                <th className="p-3">Server ID</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t">
                <td className="p-3">1</td>
                <td className="p-3">Diamond 86</td>
                <td className="p-3">1</td>
                <td className="p-3">101</td>
                <td className="p-3">123456789</td>
                <td className="p-3">2201</td>
                <td className="p-3">QRIS</td>
                <td className="p-3 text-yellow-600 font-medium">Pending</td>
                <td className="p-3">2025-06-11</td>
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

export default AdminOrder;
