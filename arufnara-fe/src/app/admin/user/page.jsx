'use client';

import React, { useState, useEffect } from "react";
import { User, Plus, Edit, Trash2, X, Save, Search, Filter } from "lucide-react";
import API from "../../../_api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    point: 0,
    role: 'user'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
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
    if (data.users && Array.isArray(data.users)) {
      return data.users;
    }
    if (data.result && Array.isArray(data.result)) {
      return data.result;
    }
    if (data.success && data.data) {
      return Array.isArray(data.data) ? data.data : [data.data];
    }
    
    // Untuk single object (create/update response)
    if (data.user) {
      return data.user;
    }
    if (data.data && !Array.isArray(data.data)) {
      return data.data;
    }
    
    // Return data as is jika tidak ada struktur khusus
    return data;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = getAuthConfig();
      const response = await API.get("/admin/users", config);
      
      const userData = extractResponseData(response);
      
      // Debug: Log struktur data yang diterima
      console.log('Raw API Response:', response.data);
      console.log('Extracted User Data:', userData);
      
      if (Array.isArray(userData)) {
        // Debug: Log beberapa user pertama untuk melihat struktur
        if (userData.length > 0) {
          console.log('Sample user data:', userData[0]);
        }
        setUsers(userData);
      } else {
        console.warn('Response data is not an array:', userData);
        setUsers([]);
      }
      
    } catch (err) {
      console.error('Fetch users error:', err);
      
      let errorMessage = 'Gagal mengambil data pengguna';
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const serverMessage = err.response.data?.message || err.response.data?.error;
        
        if (status === 401) {
          errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
        } else if (status === 403) {
          errorMessage = 'Anda tidak memiliki akses untuk melihat data pengguna.';
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
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      point: 0,
      role: 'user'
    });
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      name: typeof user.name === 'object' ? JSON.stringify(user.name) : (user.name || user.username || ''),
      username: typeof user.username === 'object' ? JSON.stringify(user.username) : (user.username || ''),
      email: typeof user.email === 'object' ? JSON.stringify(user.email) : (user.email || ''),
      password: '',
      point: typeof (user.point || user.points) === 'object' 
        ? (user.point?.total_points || user.points?.total_points || 0)
        : (user.point || user.points || 0),
      role: typeof user.role === 'object' ? JSON.stringify(user.role) : (user.role || 'user')
    });
    setIsModalOpen(true);
    setError(null); // Clear any previous errors
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      point: 0,
      role: 'user'
    });
    setError(null); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'point' ? parseInt(value) || 0 : value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Nama tidak boleh kosong');
    if (!formData.username.trim()) errors.push('Username tidak boleh kosong');
    if (!formData.email.trim()) errors.push('Email tidak boleh kosong');
    if (modalMode === 'create' && !formData.password) errors.push('Password tidak boleh kosong');
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push('Format email tidak valid');
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
      
      // Jika mode edit dan password kosong, hapus password dari data
      if (modalMode === 'edit' && !submitData.password) {
        delete submitData.password;
      }

      let response;
      let successMessage;

      if (modalMode === 'create') {
        response = await API.post('/admin/users', submitData, config);
        successMessage = "User berhasil dibuat.";
      } else {
        // Untuk edit, gunakan ID yang benar
        const userId = currentUser.id || currentUser._id;
        if (!userId) {
          throw new Error('ID user tidak ditemukan');
        }
        
        response = await API.put(`/admin/users/${userId}`, submitData, config);
        successMessage = "User berhasil diupdate.";
      }

      // Extract data dari response
      const responseData = extractResponseData(response);
      
      if (modalMode === 'create') {
        // Tambahkan user baru ke state
        if (responseData) {
          setUsers(prev => [...prev, responseData]);
        } else {
          // Jika tidak ada data response, fetch ulang untuk memastikan
          await fetchUsers();
        }
      } else {
        // Update user di state
        if (responseData) {
          setUsers(prev => prev.map(user => 
            (user.id || user._id) === (currentUser.id || currentUser._id) 
              ? { ...user, ...responseData } 
              : user
          ));
        } else {
          // Jika tidak ada data response, fetch ulang
          await fetchUsers();
        }
      }
      
      alert(successMessage);
      closeModal();
      
    } catch (err) {
      console.error('Submit error:', err);
      
      let errorMessage = `Gagal ${modalMode === 'create' ? 'membuat' : 'mengupdate'} pengguna`;
      
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
          errorMessage = 'Username atau email sudah digunakan.';
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

  const handleDelete = async (user) => {
    const userId = user.id || user._id;
    const userName = user.name || user.username || 'pengguna ini';
    
    if (!userId) {
      setError('ID user tidak ditemukan');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus ${userName}?`)) {
      try {
        setError(null);
        const config = getAuthConfig();
        
        await API.delete(`/admin/users/${userId}`, config);

        // Update state - hapus user dari daftar
        setUsers(prev => prev.filter(u => (u.id || u._id) !== userId));

        alert("User berhasil dihapus.");
        
      } catch (err) {
        console.error('Delete error:', err);
        
        let errorMessage = 'Gagal menghapus pengguna';
        
        if (err.response) {
          const status = err.response.status;
          const serverMessage = err.response.data?.message || err.response.data?.error;
          
          if (status === 401) {
            errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
          } else if (status === 403) {
            errorMessage = 'Anda tidak memiliki akses untuk menghapus pengguna.';
          } else if (status === 404) {
            errorMessage = 'Pengguna tidak ditemukan.';
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

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    // Ensure user properties are strings before filtering
    const userName = typeof user.name === 'object' ? JSON.stringify(user.name) : (user.name || '');
    const userUsername = typeof user.username === 'object' ? JSON.stringify(user.username) : (user.username || '');
    const userEmail = typeof user.email === 'object' ? JSON.stringify(user.email) : (user.email || '');
    const userRole = typeof user.role === 'object' ? JSON.stringify(user.role) : (user.role || 'user');
    
    const matchesSearch = 
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;
    
    return matchesSearch && matchesRole;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Kelola data User dan Point</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            Tambah User
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
                placeholder="Cari berdasarkan nama, username, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id || user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {typeof user.name === 'object' ? JSON.stringify(user.name) : (user.name || user.username || 'Unknown')}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{typeof user.username === 'object' ? JSON.stringify(user.username) : (user.username || 'unknown')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof user.email === 'object' ? JSON.stringify(user.email) : (user.email || '-')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {typeof (user.point || user.points) === 'object' 
                        ? (user.point?.total_points || user.points?.total_points || 0)
                        : (user.point || user.points || 0)
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.created_at ? (
                        typeof user.created_at === 'string' 
                          ? new Date(user.created_at).toLocaleDateString('id-ID')
                          : user.created_at.toLocaleDateString ? user.created_at.toLocaleDateString('id-ID') : String(user.created_at)
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <User className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Tidak ada pengguna ditemukan</p>
                      <p className="text-sm">Cobalah mengubah filter pencarian atau tambah pengguna baru</p>
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
                  {modalMode === 'create' ? 'Tambah User Baru' : 'Edit User'}
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
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan alamat email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {modalMode === 'create' && <span className="text-red-500">*</span>}
                    {modalMode === 'edit' && <span className="text-gray-500 text-xs">(kosongkan jika tidak ingin mengubah)</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={modalMode === 'create'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={modalMode === 'create' ? 'Masukkan password' : 'Kosongkan jika tidak diubah'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                  <input
                    type="number"
                    name="point"
                    value={formData.point}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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