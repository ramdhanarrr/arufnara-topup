
// app/admin/topup.jsx 
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
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Diamond Package Management</h1>
            <p className="text-gray-600">Kelola paket diamond</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            <Plus size={20} />
            Tambah Paket
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 border-l-4 border-red-400 rounded-r-lg bg-red-50">
          <div className="flex items-start justify-between">
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
      <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan jumlah diamond, harga, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Diamond
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Bonus
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Harga
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Total Diamond
                </th>
                <th className="px-6 py-4 text-xs font-bold text-left text-blue-900 uppercase tracking-widest border-b border-blue-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTopups.length > 0 ? (
                filteredTopups.map((topup, idx) => {
                  const diamondAmount = topup.diamond_amount || topup.jumlah_diamond || topup.amount || 0;
                  const bonusDiamond = topup.bonus_diamond || topup.bonus || 0;
                  const price = topup.price || topup.harga || 0;
                  const totalDiamond = diamondAmount + bonusDiamond;

                  return (
                    <tr
                      key={topup.id || topup._id}
                      className={`transition-colors duration-150 ${
                        idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"
                      } hover:bg-blue-100/60`}
                    >
                      <td className="px-6 py-4 font-semibold text-blue-900 border-b border-blue-100 whitespace-nowrap">
                        <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 rounded-lg text-xs font-mono tracking-wider shadow-sm">
                          {topup.id || topup._id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-900 border-b border-blue-100 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-300 to-blue-500 flex items-center justify-center text-white font-bold text-base shadow">
                            <Diamond className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">
                            {diamondAmount.toLocaleString()} Diamond
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-100 whitespace-nowrap">
                        {bonusDiamond > 0 ? (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                            +{bonusDiamond.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-blue-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-blue-900 border-b border-blue-100 whitespace-nowrap font-semibold">
                        {typeof price === 'number' ? formatCurrency(price) : price}
                      </td>
                      <td className="px-6 py-4 border-b border-blue-100 whitespace-nowrap">
                        <span className="inline-block px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-blue-800">
                          {totalDiamond.toLocaleString()} Total
                        </span>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-100 whitespace-nowrap space-x-2 text-sm">
                        <button
                          onClick={() => openEditModal(topup)}
                          className="inline-flex items-center px-3 py-1 text-blue-700 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 shadow"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(topup)}
                          className="inline-flex items-center px-3 py-1 text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200 shadow"
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
                  <td colSpan="6" className="px-6 py-12 text-center text-blue-400">
                    <div className="flex flex-col items-center">
                      <Diamond className="w-12 h-12 mb-4 text-blue-200" />
                      <p className="text-lg font-semibold">Tidak ada paket diamond ditemukan</p>
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
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Error Display */}
              {error && (
                <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
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
                  <label className="block mb-1 text-sm font-medium text-gray-700">
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
                  <label className="block mb-1 text-sm font-medium text-gray-700">
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
                  <p className="mt-1 text-xs text-gray-500">
                    Preview: {formData.price > 0 ? formatCurrency(formData.price) : 'Rp 0'}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
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
                <div className="p-3 rounded-lg bg-blue-50">
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

                <div className="flex justify-end pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
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