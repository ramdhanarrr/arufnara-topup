// app/admin/order/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Edit, X, Search, Filter, Package, CreditCard, Save } from 'lucide-react';
import API from '../../../_api';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [topupOptions, setTopupOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    ml_user_id: '',
    server_id: '',
    topup_option_id: '',
    payment_method: '',
    status: 'pending',
  });
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchTopupOptions();
  }, []);

  const getToken = () =>
    localStorage.getItem('token') || sessionStorage.getItem('token');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const extractData = (res) => {
    const d = res?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.orders)) return d.orders;
    if (Array.isArray(d?.result)) return d.result;
    return d?.data || d?.order || [];
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/orders', getAuthConfig());
      setOrders(extractData(res));
    } catch (err) {
      setError('Gagal memuat data order.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopupOptions = async () => {
    try {
      const res = await API.get('/topup_options', getAuthConfig());
      setTopupOptions(extractData(res));
    } catch (err) {
      console.error('Gagal memuat topup options:', err);
    }
  };

  const openEditModal = (order) => {
    setFormData({
      user_id: order.user_id || '',
      ml_user_id: order.ml_user_id || '',
      server_id: order.server_id || '',
      topup_option_id: order.topup_option_id || order.topup_option?.id || '',
      payment_method: order.payment_method || '',
      status: order.status || 'pending',
    });
    setSelectedOrderId(order.id || order._id);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrderId) {
      setError('ID order tidak ditemukan.');
      return;
    }

    try {
      setLoading(true);
      
      // Validasi form data
      if (!formData.status) {
        setError('Status harus dipilih.');
        return;
      }

      // Coba beberapa endpoint dan format data yang mungkin digunakan backend
      let response;
      
      try {
        // Opsi 1: Endpoint khusus status dengan format sederhana
        response = await API.put(`/admin/orders/${selectedOrderId}/status`, 
          { status: formData.status }, 
          getAuthConfig()
        );
      } catch (statusErr) {
        console.log('Status endpoint failed, trying alternative formats...');
        
        try {
          // Opsi 2: Endpoint status dengan format berbeda
          response = await API.put(`/admin/orders/${selectedOrderId}/status`, 
            { order_status: formData.status }, 
            getAuthConfig()
          );
        } catch (altErr) {
          try {
            // Opsi 3: Endpoint update penuh
            response = await API.put(`/admin/orders/${selectedOrderId}`, 
              { status: formData.status }, 
              getAuthConfig()
            );
          } catch (fullErr) {
            // Opsi 4: Menggunakan PATCH method
            response = await API.patch(`/admin/orders/${selectedOrderId}`, 
              { status: formData.status }, 
              getAuthConfig()
            );
          }
        }
      }
      
      // Update state langsung untuk performa lebih baik
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order.id || order._id) === selectedOrderId 
            ? { ...order, status: formData.status }
            : order
        )
      );
      
      setIsModalOpen(false);
      setError(null);
      
      // Refresh data dari server untuk memastikan sinkronisasi
      await fetchOrders();
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Terjadi kesalahan tidak diketahui';
      
      setError(`Gagal mengupdate order: ${errorMessage}`);
      console.error('Error updating order:', err);
      console.error('Error response:', err.response?.data);
      console.error('Request data:', { status: formData.status });
      console.error('Order ID:', selectedOrderId);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setFormData({
      user_id: '',
      ml_user_id: '',
      server_id: '',
      topup_option_id: '',
      payment_method: '',
      status: 'pending',
    });
    setError(null);
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTopup = (order) => {
    const opt = order.topup_option || topupOptions.find(o => o.id === order.topup_option_id);
    if (!opt) return '-';
    const diamond = opt.diamond_amount || opt.amount || 0;
    const bonus = opt.bonus_diamond || 0;
    const price = opt.price || 0;
    return `${diamond.toLocaleString()}${bonus ? ' +'+bonus : ''} - ${formatCurrency(price)}`;
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    return s === 'pending' ? 'bg-yellow-100 text-yellow-800'
      : s === 'paid' ? 'bg-green-100 text-green-800'
      : s === 'failed' ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const searchString = `${order.id || order._id || ''}${order.user_id || ''}${order.ml_user_id || ''}${order.server_id || ''}${order.payment_method || ''}`.toLowerCase();
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    return searchString.includes(term) && statusMatch;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64 p-6">
      <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="mb-1 text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-600">Kelola data pemesanan pengguna</p>
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
              <h2 className="text-xl font-semibold">Edit Order</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 font-medium text-gray-900">Informasi Order</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order ID:</span>
                    <span className="ml-2 font-medium">#{selectedOrderId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">User ID:</span>
                    <span className="ml-2 font-medium">{formData.user_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ML User ID:</span>
                    <span className="ml-2 font-medium">{formData.ml_user_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Server ID:</span>
                    <span className="ml-2 font-medium">{formData.server_id}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status *</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
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
            <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan ID, user, metode..."
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
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">ID</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">User</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">ML Account</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Topup</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Metode</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-left text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.id || order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{order.id || order._id}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.user_id || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div>ID: {order.ml_user_id || '-'}</div>
                    <div className="text-sm text-gray-500">Server: {order.server_id || '-'}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{formatTopup(order)}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                      {order.payment_method || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                      {order.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(order)}
                        className="inline-flex items-center px-3 py-1 text-sm text-blue-700 transition-colors bg-blue-100 rounded-md hover:bg-blue-200"
                        disabled={loading}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Tidak ada order ditemukan</p>
                      <p className="text-sm">Cobalah ubah pencarian atau filter</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;