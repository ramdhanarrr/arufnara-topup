
// app/admin/topup.jsx 
import React from "react";

'use client';

import React, { useState, useEffect } from "react";
import { Diamond, Plus, Edit, Trash2, X, Save, Search, Filter } from "lucide-react";
import API from "../../../_api";

export default function AdminTopUp() {
  const [topups, setTopups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentTopup, setCurrentTopup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [formData, setFormData] = useState({
    diamond_amount: 0,
    bonus_diamond: 0,
    price: 0,
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTopups();
  }, []);

  // Helper function untuk mendapatkan auth token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('authToken') ||
           sessionStorage.getItem('token');
  };

  // Helper function untuk membuat config dengan auth header
  const getAuthConfig = () => {
    const token = getAuthToken();
    return token ? {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    } : {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  };

  // Helper function untuk extract data dari response
  const extractResponseData = (response, fallbackKey = 'data') => {
    const data = response?.data;
    
    if (!data) return null;
    
    // Jika response berupa array langsung
    if (Array.isArray(data)) {
      return data;
    }
    
    // Cek berbagai kemungkinan struktur response
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data.topups && Array.isArray(data.topups)) {
      return data.topups;
    }
    if (data.diamonds && Array.isArray(data.diamonds)) {
      return data.diamonds;
    }
    if (data.result && Array.isArray(data.result)) {
      return data.result;
    }
    if (data.success && data.data) {
      return Array.isArray(data.data) ? data.data : [data.data];
    }
    
    // Untuk single object (create/update response)
    if (data.topup) {
      return data.topup;
    }
    if (data.diamond) {
      return data.diamond;
    }
    if (data.data && !Array.isArray(data.data)) {
      return data.data;
    }
    
    // Return data as is jika tidak ada struktur khusus
    return data;
  };

  const fetchTopups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = getAuthConfig();
      const response = await API.get("/topup_options", config);
      
      const topupData = extractResponseData(response);
      
      // Debug: Log struktur data yang diterima
      console.log('Raw API Response:', response.data);
      console.log('Extracted Topup Data:', topupData);
      
      if (Array.isArray(topupData)) {
        // Debug: Log beberapa topup pertama untuk melihat struktur
        if (topupData.length > 0) {
          console.log('Sample topup data:', topupData[0]);
        }
        setTopups(topupData);
      } else {
        console.warn('Response data is not an array:', topupData);
        setTopups([]);
      }
      
    } catch (err) {
      console.error('Fetch topups error:', err);
      
      let errorMessage = 'Gagal mengambil data paket diamond';
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error;
        
        if (status === 401) {
          errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        } else if (status === 403) {
          errorMessage = 'Anda tidak memiliki akses untuk melihat data paket diamond.';
        } else if (status === 404) {
          errorMessage = 'Endpoint tidak ditemukan. Periksa konfigurasi API.';
        } else if (serverMessage) {
          errorMessage = `${errorMessage}: ${serverMessage}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      
      setError(errorMessage);
      setTopups([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentTopup(null);
    setFormData({
      diamond_amount: 0,
      bonus_diamond: 0,
      price: 0,
      description: ''
    });
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const openEditModal = (topup) => {
    setModalMode('edit');
    setCurrentTopup(topup);
    setFormData({
      diamond_amount: topup.diamond_amount || topup.jumlah_diamond || topup.amount || 0,
      bonus_diamond: topup.bonus_diamond || topup.bonus || 0,
      price: topup.price || topup.harga || 0,
      description: topup.description || topup.keterangan || ''
    });
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTopup(null);
    setFormData({
      diamond_amount: 0,
      bonus_diamond: 0,
      price: 0,
      description: ''
    });
    setError(null); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['diamond_amount', 'bonus_diamond', 'price'].includes(name) 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.diamond_amount || formData.diamond_amount <= 0) {
      errors.push('Jumlah diamond harus lebih dari 0');
    }
    if (formData.price <= 0) {
      errors.push('Harga harus lebih dari 0');
    }
    if (formData.bonus_diamond < 0) {
      errors.push('Bonus diamond tidak boleh negatif');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const config = getAuthConfig();
      
      // Prepare data untuk dikirim
      const submitData = { ...formData };

      let response;
      let successMessage;

      if (modalMode === 'create') {
        response = await API.post('/admin/topup-options', submitData, config);
        successMessage = "Paket diamond berhasil dibuat.";
      } else {
        // Untuk edit, gunakan ID yang benar
        const topupId = currentTopup.id || currentTopup._id;
        if (!topupId) {
          throw new Error('ID topup tidak ditemukan');
        }
        
        response = await API.put(`/admin/topup-options/${topupId}`, submitData, config);
        successMessage = "Paket diamond berhasil diupdate.";
      }

      // Extract data dari response
      const responseData = extractResponseData(response);
      
      if (modalMode === 'create') {
        // Tambahkan topup baru ke state
        if (responseData) {
          setTopups(prev => [...prev, responseData]);
        } else {
          // Jika tidak ada data response, fetch ulang untuk memastikan
          await fetchTopups();
        }
      } else {
        // Update topup di state
        if (responseData) {
          setTopups(prev => prev.map(topup => 
            (topup.id || topup._id) === (currentTopup.id || currentTopup._id) 
              ? { ...topup, ...responseData } 
              : topup
          ));
        } else {
          // Jika tidak ada data response, fetch ulang
          await fetchTopups();
        }
      }
      
      alert(successMessage);
      closeModal();
      
    } catch (err) {
      console.error('Submit error:', err);
      
      let errorMessage = `Gagal ${modalMode === 'create' ? 'membuat' : 'mengupdate'} paket diamond`;
      
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error;
        
        if (status === 400) {
          errorMessage = serverMessage || 'Data yang dikirim tidak valid';
        } else if (status === 401) {
          errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        } else if (status === 403) {
          errorMessage = 'Anda tidak memiliki akses untuk melakukan operasi ini.';
        } else if (status === 409) {
          errorMessage = 'Paket diamond dengan jumlah ini sudah ada.';
        } else if (serverMessage) {
          errorMessage = `${errorMessage}: ${serverMessage}`;
        }
      } else if (err.request) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (err.message) {
        errorMessage = `${errorMessage}: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (topup) => {
    const topupId = topup.id || topup._id;
    const topupName = `${topup.diamond_amount || topup.jumlah_diamond || topup.amount || 0} Diamond`;
    
    if (!topupId) {
      setError('ID topup tidak ditemukan');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus paket ${topupName}?`)) {
      try {
        setError(null);
        const config = getAuthConfig();
        
        await API.delete(`/admin/topup-options/${topupId}`, config);

        // Update state - hapus topup dari daftar
        setTopups(prev => prev.filter(t => (t.id || t._id) !== topupId));

        alert("Paket diamond berhasil dihapus.");
        
      } catch (err) {
        console.error('Delete error:', err);
        
        let errorMessage = 'Gagal menghapus paket diamond';
        
        if (err.response) {
          const status = err.response.status;
          const serverMessage = err.response.data?.message || err.response.data?.error;
          
          if (status === 401) {
            errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
          } else if (status === 403) {
            errorMessage = 'Anda tidak memiliki akses untuk menghapus paket diamond.';
          } else if (status === 404) {
            errorMessage = 'Paket diamond tidak ditemukan.';
          } else if (serverMessage) {
            errorMessage = `${errorMessage}: ${serverMessage}`;
          }
        } else if (err.request) {
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        }
        
        setError(errorMessage);
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

  // Filter topups based on search term and price range
  const filteredTopups = topups.filter(topup => {
    const diamondAmount = topup.diamond_amount || topup.jumlah_diamond || topup.amount || 0;
    const price = topup.price || topup.harga || 0;
    const description = topup.description || topup.keterangan || '';
    
    const matchesSearch = 
      diamondAmount.toString().includes(searchTerm) ||
      price.toString().includes(searchTerm) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter !== 'all') {
      const numPrice = typeof price === 'number' ? price : parseInt(price) || 0;
      switch(priceFilter) {
        case 'low':
          matchesPrice = numPrice < 50000;
          break;
        case 'medium':
          matchesPrice = numPrice >= 50000 && numPrice < 200000;
          break;
        case 'high':
          matchesPrice = numPrice >= 200000;
          break;
        default:
          matchesPrice = true;
      }
    }
    
    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Diamond Package Management</h1>
            <p className="text-gray-600">Kelola paket diamond</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            Tambah Paket
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
          <div className="flex justify-between items-start">
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan jumlah diamond, harga, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Harga</option>
              <option value="low">Rp 50.000</option>
              <option value="medium">Rp 50.000 - Rp 200.000</option>
              <option value="high"> Rp 200.000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Diamond Packages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diamond</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Diamond</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTopups.length > 0 ? (
                filteredTopups.map((topup) => {
                  const diamondAmount = topup.diamond_amount || topup.jumlah_diamond || topup.amount || 0;
                  const bonusDiamond = topup.bonus_diamond || topup.bonus || 0;
                  const price = topup.price || topup.harga || 0;
                  const totalDiamond = diamondAmount + bonusDiamond;
                  
                  return (
                    <tr key={topup.id || topup._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {topup.id || topup._id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Diamond className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {diamondAmount.toLocaleString()} Diamond
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {bonusDiamond > 0 ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            +{bonusDiamond.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {typeof price === 'number' ? formatCurrency(price) : price}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {totalDiamond.toLocaleString()} Total
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => openEditModal(topup)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(topup)}
                          className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Diamond className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Tidak ada paket diamond ditemukan</p>
                      <p className="text-sm">Cobalah mengubah filter pencarian atau tambah paket baru</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === 'create' ? 'Tambah Paket Diamond Baru' : 'Edit Paket Diamond'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Diamond <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="diamond_amount"
                    value={formData.diamond_amount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan jumlah diamond"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bonus Diamond
                  </label>
                  <input
                    type="number"
                    name="bonus_diamond"
                    value={formData.bonus_diamond}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bonus diamond (opsional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan harga dalam Rupiah"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preview: {formData.price > 0 ? formatCurrency(formData.price) : 'Rp 0'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deskripsi paket (opsional)"
                  />
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Ringkasan Paket:</p>
                  <p className="text-sm text-blue-700">
                    {formData.diamond_amount.toLocaleString()} Diamond 
                    {formData.bonus_diamond > 0 && ` + ${formData.bonus_diamond.toLocaleString()} Bonus`} = 
                    <strong> {(formData.diamond_amount + formData.bonus_diamond).toLocaleString()} Total Diamond</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    Harga: <strong>{formData.price > 0 ? formatCurrency(formData.price) : 'Rp 0'}</strong>
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {isSubmitting ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan' : 'Update')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
