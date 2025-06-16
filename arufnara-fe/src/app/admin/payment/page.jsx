// app/admin/payment/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Download, CheckCircle, Search, Filter, X, Package, Edit, Save } from 'lucide-react';
import API from '../../../_api';

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [formData, setFormData] = useState({
    payment_status: 'success'
  });
    
  useEffect(() => {
    fetchPayments();
  }, []);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const extractData = (res) => {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.payments)) return d.payments;
    if (Array.isArray(d?.result)) return d.result;
    return d?.data || d?.payment || [];
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/payments', getAuthConfig());
      setPayments(extractData(res));
    } catch (err) {
      setError('Gagal memuat data pembayaran.');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (payment) => {
    setFormData({
      payment_status: payment.payment_status || 'success'
    });
    setSelectedPaymentId(payment.id || payment._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentId(null);
    setFormData({
      payment_status: 'success'
    });
    setError(null);
  };

  const handleUpdate = async () => {
    if (!selectedPaymentId) {
      setError('ID payment tidak ditemukan.');
      return;
    }

    try {
      setLoading(true);
      
      // Validasi form data
      if (!formData.payment_status || !['success', 'failed'].includes(formData.payment_status)) {
        setError('Status harus success atau failed.');
        return;
      }

      console.log('Updating payment with:', {
        id: selectedPaymentId,
        payment_status: formData.payment_status,
        url: `/admin/payments/${selectedPaymentId}/status`,
        method: 'PATCH'
      });

      // Use the exact endpoint that matches your route
      const response = await API.patch(`/admin/payments/${selectedPaymentId}/status`, 
        { 
          payment_status: formData.payment_status 
        }, 
        {
          ...getAuthConfig(),
          headers: {
            ...getAuthConfig().headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      // Check if response is successful
      if (response.data && response.data.success) {
        // Update state langsung untuk performa lebih baik
        setPayments(prevPayments => 
          prevPayments.map(payment => 
            (payment.id || payment._id) === selectedPaymentId 
              ? { ...payment, payment_status: formData.payment_status }
              : payment
          )
        );
        
        setIsModalOpen(false);
        setError(null);
        
        // Show success message
        alert('Payment status berhasil diupdate!');
        
        // Refresh data dari server untuk memastikan sinkronisasi
        await fetchPayments();
      } else {
        throw new Error(response.data?.message || 'Response tidak valid');
      }
      
    } catch (err) {
      console.error('=== Error Details ===');
      console.error('Payment ID:', selectedPaymentId);
      console.error('Request data:', { payment_status: formData.payment_status });
      console.error('Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Terjadi kesalahan tidak diketahui';
      
      if (err.response) {
        // Server responded with error status
        const { status, data } = err.response;
        
        if (status === 422) {
          // Validation error
          const validationErrors = data.errors || {};
          const errorMessages = Object.values(validationErrors).flat();
          errorMessage = `Validation Error: ${errorMessages.join(', ')}`;
        } else if (status === 404) {
          errorMessage = 'Payment tidak ditemukan';
        } else if (status === 403) {
          errorMessage = 'Tidak memiliki akses untuk mengupdate payment';
        } else if (status === 401) {
          errorMessage = 'Sesi login telah berakhir, silakan login ulang';
        } else {
          errorMessage = data.message || data.error || `Server error (${status})`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Gagal terhubung ke server. Periksa koneksi internet Anda.';
      } else {
        errorMessage = err.message;
      }
      
      setError(`Gagal mengupdate payment status: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusClass = (status) => {
    const s = status?.toLowerCase();
    return s === 'success' ? 'bg-green-100 text-green-800'
      : s === 'failed' ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800';
  };

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const statusMatch = statusFilter === 'all' || payment.payment_status === statusFilter;
    const searchString = `${payment.id || payment._id || ''}${payment.order_id || ''}${payment.amount || ''}${payment.transaction_date || ''}`.toLowerCase();
    return searchString.includes(term) && statusMatch;
  });

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const openDetail = (payment) => {
    setSelectedPayment(payment);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedPayment(null);
    setIsDetailOpen(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 p-6">
      <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-sm text-gray-600">Kelola data pembayaran pengguna</p>
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Payment Status</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-medium text-gray-900">Informasi Payment</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="ml-2 font-medium">#{selectedPaymentId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Status:</span>
                    <span className="ml-2 font-medium">{formData.payment_status}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Payment Status *</label>
                <select 
                  value={formData.payment_status} 
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pilih status pembayaran: Success (berhasil) atau Failed (gagal)
                </p>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Batal
                </button>
                <button 
                  onClick={handleUpdate} 
                  className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} /> 
                  {loading ? 'Menyimpan...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
              size={20}
            />
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
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Order ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Bukti
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.length > 0 ? filteredPayments.map(payment => (
                <tr key={payment.id || payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{payment.id || payment._id}
                  </td>
                  <td className="px-6 py-4 text-gray-700">#{payment.order_id || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-gray-700">{formatDate(payment.transaction_date)}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">Order: {payment.order?.status || '-'}</div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusClass(payment.payment_status)}`}>
                        Payment: {payment.payment_status || 'unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payment.proof_of_payment ? (
                      <a
                        href={payment.proof_of_payment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <Download size={16} className="inline mr-1" /> Lihat
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(payment)}
                        className="inline-flex items-center px-3 py-1 text-sm text-blue-700 transition-colors bg-blue-100 rounded-md hover:bg-blue-200"
                        disabled={loading}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      <button 
                        onClick={() => openDetail(payment)} 
                        className="inline-flex items-center px-3 py-1 text-sm text-green-700 transition-colors bg-green-100 rounded-md hover:bg-green-200"
                      >
                        <Eye size={14} className="mr-1" /> Detail
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-blue-400"
                  >
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 mb-4 text-blue-200" />
                      <p className="text-lg font-semibold">
                        Tidak ada pembayaran ditemukan
                      </p>
                      <p className="text-sm">
                        Cobalah ubah pencarian atau filter
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Detail Pembayaran</h2>
              <button onClick={closeDetail} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="ml-2 font-medium">#{selectedPayment.id || selectedPayment._id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <span className="ml-2 font-medium">#{selectedPayment.order_id || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`ml-2 inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusClass(selectedPayment.payment_status)}`}>
                      {selectedPayment.payment_status || 'unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tanggal Transaksi:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedPayment.transaction_date)}</span>
                  </div>
                  {selectedPayment.proof_of_payment && (
                    <div>
                      <span className="text-gray-600">Bukti Pembayaran:</span>
                      <div className="mt-1">
                        <a
                          href={selectedPayment.proof_of_payment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <Download size={16} className="inline mr-1" />
                          Lihat Bukti Pembayaran
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayment;