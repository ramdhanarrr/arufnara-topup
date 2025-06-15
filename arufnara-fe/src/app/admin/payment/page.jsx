// app/admin/payment/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, Search, Filter, X, Package } from 'lucide-react';
import API from '../../../_api';

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/payments', getAuthConfig());
      const data = res?.data?.data || res?.data?.payments || [];
      setPayments(data);
    } catch (err) {
      setError('Gagal memuat data pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/payments/${id}/status`, { payment_status: status }, getAuthConfig());
      fetchPayments();
    } catch (err) {
      setError('Gagal memperbarui status pembayaran.');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const term = searchTerm.toLowerCase();
    const statusMatch = statusFilter === 'all' || payment.payment_status === statusFilter;
    const match = `${payment.id}${payment.order_id}${payment.amount}${payment.transaction_date}`.toLowerCase();
    return match.includes(term) && statusMatch;
  });

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const openDetail = (payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedPayment(null);
    setIsDetailOpen(false);
  };

  if (loading) 
  
  return (
    <div className="p-6 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Payment Management</h1>
        <p className="text-sm text-gray-600">Kelola data pembayaran pengguna</p>
        </div>
        
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 underline text-sm mt-1"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan ID, order, tanggal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tanggal</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Bukti</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4">{p.order_id}</td>
                  <td className="px-6 py-4">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">{formatDate(p.transaction_date)}</td>
                  <td className="px-6 py-4 capitalize">{p.payment_status}</td>
                  <td className="px-6 py-4">
                    {p.proof_of_payment ? (
                      <a
                        href={p.proof_of_payment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Download size={16} className="inline mr-1" /> Lihat
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => openDetail(p)} className="text-blue-600 hover:underline">
                      <Eye size={16} className="inline mr-1" /> Detail
                    </button>
                    {p.payment_status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(p.id, 'confirmed')}
                        className="text-green-600 hover:underline"
                      >
                        <CheckCircle size={16} className="inline mr-1" /> Konfirmasi
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Tidak ada pembayaran ditemukan</p>
                      <p className="text-sm">Cobalah ubah pencarian atau filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
            <button onClick={closeDetail} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Detail Pembayaran</h2>
            <div className="space-y-2 text-sm">
              <div><strong>ID:</strong> {selectedPayment.id}</div>
              <div><strong>Order ID:</strong> {selectedPayment.order_id}</div>
              <div><strong>Amount:</strong> {formatCurrency(selectedPayment.amount)}</div>
              <div><strong>Status:</strong> {selectedPayment.payment_status}</div>
              <div><strong>Tanggal Transaksi:</strong> {formatDate(selectedPayment.transaction_date)}</div>
              {selectedPayment.proof_of_payment && (
                <div>
                  <strong>Bukti:</strong>
                  <a
                    href={selectedPayment.proof_of_payment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 underline mt-1"
                  >
                    Lihat Bukti Pembayaran
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;
