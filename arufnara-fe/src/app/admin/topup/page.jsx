// app/admin/topup.jsx
import React from "react";

const AdminTopUp = () => {
  return (
    <section>
        <h2 className="text-xl font-semibold mb-4">Diamond Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="p-3">Id</th>
                <th className="p-3">Jumlah Diamond</th>
                <th className="p-3">Bonus Diamond</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-t">
                <td className="p-3">1</td>
                <td className="p-3">100</td>
                <td className="p-3">10</td>
                <td className="p-3">Rp 15.000</td>
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
  )
};

export default AdminTopUp;
