'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../../_api';

const CreateTopup = () => {
  const [diamondAmount, setDiamondAmount] = useState('');
  const [bonusDiamond, setBonusDiamond] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken') || 
                 localStorage.getItem('token') || 
                 sessionStorage.getItem('authToken');
    
    if (!token) {
      alert('Anda harus login terlebih dahulu');
      router.push('/login');
      return;
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get auth token
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   sessionStorage.getItem('authToken');

      if (!token) {
        throw new Error('Token autentikasi tidak ditemukan');
      }

      const payload = {
        diamond_amount: parseInt(diamondAmount),
        bonus_diamond: parseInt(bonusDiamond) || 0,
        price: parseFloat(price),
      };

      // Add auth header to request
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await API.post('/admin/topup-options', payload, config);
      
      alert('Topup berhasil ditambahkan.');
      router.push('/admin/topup');
    } catch (err) {
      console.error('Create topup error:', err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
        // Clear tokens and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        sessionStorage.removeItem('authToken');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('Anda tidak memiliki akses untuk membuat topup option.');
      } else if (err.response?.status === 422) {
        // Validation errors
        const errors = err.response.data.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join(', ');
          setError(`Validation error: ${errorMessages}`);
        } else {
          setError(err.response.data.message || 'Data yang dimasukkan tidak valid.');
        }
      } else {
        setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/topup');
  };

  return (
    <section className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Tambah Paket Diamond</h2>
        <p className="text-gray-600">Buat paket diamond baru untuk pengguna</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">
            Jumlah Diamond <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={diamondAmount}
            onChange={(e) => setDiamondAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan jumlah diamond"
            min="1"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Bonus Diamond</label>
          <input
            type="number"
            value={bonusDiamond}
            onChange={(e) => setBonusDiamond(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan bonus diamond (opsional)"
            min="0"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">Kosongkan jika tidak ada bonus</p>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Harga (IDR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan harga dalam Rupiah"
            min="100"
            required
            disabled={loading}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </form>

      {/* Preview section */}
      {(diamondAmount || price) && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Preview Paket:</h3>
          <div className="text-sm text-gray-700">
            <p><strong>Diamond:</strong> {diamondAmount || 0}</p>
            <p><strong>Bonus:</strong> +{bonusDiamond || 0}</p>
            <p><strong>Total:</strong> {(parseInt(diamondAmount) || 0) + (parseInt(bonusDiamond) || 0)} Diamond</p>
            <p><strong>Harga:</strong> {price ? `Rp ${parseInt(price).toLocaleString('id-ID')}` : 'Rp 0'}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateTopup;