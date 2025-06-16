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
    <div className="flex items-center justify-center h-64 p-6">
      <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
        <h1 className="mb-1 text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-sm text-gray-600">Kelola data pembayaran pengguna</p>
        </div>
        
      </div>

      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-1 text-sm text-red-600 underline"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan ID, order, tanggal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">ID</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Amount</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Tanggal</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Bukti</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4">{p.order_id}</td>
                  <td className="px-6 py-4">{formatCurrency(p.amount)}</td>
                  <td className="px-6 py-4">{formatDate(p.transaction_date)}</td>
                  <td className="px-6 py-4 capitalize">
                        Order: {p.order?.status || '-'}<br />
                        Payment: {p.payment_status}
                </td>
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
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 mb-4 text-gray-300" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-lg">
            <button onClick={closeDetail} className="absolute text-gray-500 top-4 right-4 hover:text-black">
              <X size={20} />
            </button>
            <h2 className="mb-4 text-xl font-bold">Detail Pembayaran</h2>
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
                    className="block mt-1 text-blue-600 underline"
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