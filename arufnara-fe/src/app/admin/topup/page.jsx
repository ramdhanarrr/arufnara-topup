'use client';

import React, { useState, useEffect } from "react";
import API from "../../../_api";

const AdminTopUp = () => {
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopups = async () => {
      try {
        setLoading(true);
        // Tidak menggunakan auth token untuk topup
        const response = await API.get("/topup_options");

        // Cek berbagai kemungkinan struktur response
        let topupData = response.data;
        
        // Jika response berupa { data: [...] }
        if (topupData && topupData.data && Array.isArray(topupData.data)) {
          topupData = topupData.data;
        }
        // Jika response berupa { topups: [...] }
        else if (topupData && topupData.topups && Array.isArray(topupData.topups)) {
          topupData = topupData.topups;
        }
        // Jika response berupa { result: [...] }
        else if (topupData && topupData.result && Array.isArray(topupData.result)) {
          topupData = topupData.result;
        }
        // Jika response berupa { success: true, data: [...] }
        else if (topupData && topupData.success && topupData.data) {
          topupData = topupData.data;
        }
        // Jika response berupa { diamonds: [...] }
        else if (topupData && topupData.diamonds && Array.isArray(topupData.diamonds)) {
          topupData = topupData.diamonds;
        }
        
        setTopups(Array.isArray(topupData) ? topupData : []);
        setError(null);
      } catch (err) {
        setError(`Gagal mengambil data topup: ${err.message}`);
        setTopups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopups();
  }, []);

  const handleEdit = (topupId) => {
  window.location.href = `/admin/topup/edit?id=${topupId}`;
};

  const handleDelete = async (topupId) => {
  if (window.confirm("Apakah Anda yakin ingin menghapus paket diamond ini?")) {
    try {
      await API.delete(`/admin/topup-options/${topupId}`);

      // Perbarui state
      setTopups(topups.filter(topup => topup.id !== topupId));

      // Tambahkan pop-up sukses
      alert("Topup berhasil dihapus.");
    } catch (err) {
      alert("Gagal menghapus topup: " + err.message);
    }
  }
};

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <section className="p-4">
        <h2 className="text-xl font-semibold mb-4">Diamond Table</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4">Diamond Table</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <a
          href="/admin/topup/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Tambah Topup
        </a>
      </div>
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
            {topups.length > 0 ? (
              topups.map((topup) => (
                <tr key={topup.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{topup.id}</td>
                  <td className="p-3">
                    <span className="font-medium text-blue-600">
                      {topup.diamond_amount || topup.jumlah_diamond || topup.amount}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-green-600">
                      +{topup.bonus_diamond || topup.bonus || 0}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800">
                      {typeof topup.price === 'number' 
                        ? formatCurrency(topup.price)
                        : topup.price || topup.harga || 'N/A'
                      }
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button 
                      onClick={() => handleEdit(topup.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(topup.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  {error ? "Tidak dapat memuat data topup" : "Tidak ada data paket diamond"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminTopUp;