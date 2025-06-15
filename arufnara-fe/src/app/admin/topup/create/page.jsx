'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../../_api';

const CreateTopup = () => {
  const [diamondAmount, setDiamondAmount] = useState('');
  const [bonusDiamond, setBonusDiamond] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        diamond_amount: parseInt(diamondAmount),
        bonus_diamond: parseInt(bonusDiamond) || 0,
        price: parseFloat(price),
      };

      await API.post('/admin/topup-options', payload);
      alert('Topup berhasil ditambahkan.');
      router.push('/admin/topup');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <section className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tambah Paket Diamond</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Jumlah Diamond</label>
          <input
            type="number"
            value={diamondAmount}
            onChange={(e) => setDiamondAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Bonus Diamond</label>
          <input
            type="number"
            value={bonusDiamond}
            onChange={(e) => setBonusDiamond(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Harga (IDR)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan
        </button>
      </form>
    </section>
  );
};

export default CreateTopup;
