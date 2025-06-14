'use client';

import React, { useState, useEffect } from "react";
import API from "../../../_api";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [paymentsError, setPaymentsError] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchPayments();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem("token");
      const response = await API.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cek berbagai kemungkinan struktur response
      let orderData = response.data;
      
      if (orderData && orderData.data && Array.isArray(orderData.data)) {
        orderData = orderData.data;
      } else if (orderData && orderData.orders && Array.isArray(orderData.orders)) {
        orderData = orderData.orders;
      } else if (orderData && orderData.result && Array.isArray(orderData.result)) {
        orderData = orderData.result;
      } else if (orderData && orderData.success && orderData.data) {
        orderData = orderData.data;
      }
      
      setOrders(Array.isArray(orderData) ? orderData : []);
      setOrdersError(null);
    } catch (err) {
      setOrdersError(`Gagal mengambil data order: ${err.message}`);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true);
      const token = localStorage.getItem("token");
      const response = await API.get("/admin/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cek berbagai kemungkinan struktur response
      let paymentData = response.data;
      
      if (paymentData && paymentData.data && Array.isArray(paymentData.data)) {
        paymentData = paymentData.data;
      } else if (paymentData && paymentData.payments && Array.isArray(paymentData.payments)) {
        paymentData = paymentData.payments;
      } else if (paymentData && paymentData.result && Array.isArray(paymentData.result)) {
        paymentData = paymentData.result;
      } else if (paymentData && paymentData.success && paymentData.data) {
        paymentData = paymentData.data;
      }
      
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setPaymentsError(null);
    } catch (err) {
      setPaymentsError(`Gagal mengambil data payment: ${err.message}`);
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Event handlers untuk Orders
  const handleEditOrder = (orderId) => {
    console.log("Edit order:", orderId);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus order ini?")) {
      console.log("Delete order:", orderId);
    }
  };

  // Event handlers untuk Payments
  const handleEditPayment = (paymentId) => {
    console.log("Edit payment:", paymentId);
  };

  const handleDeletePayment = (paymentId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus payment ini?")) {
      console.log("Delete payment:", paymentId);
    }
  };

  // Function untuk menangani object display
  const safeDisplayValue = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) {
      return fallback;
    }
    
    if (typeof value === 'object') {
      // Jika object memiliki properti 'code', ambil code-nya
      if (value.code) {
        return String(value.code);
      }
      // Jika object memiliki properti 'id', ambil id-nya
      if (value.id) {
        return String(value.id);
      }
      // Jika object memiliki properti 'name', ambil name-nya
      if (value.name) {
        return String(value.name);
      }
      // Jika tidak ada properti yang dikenal, tampilkan JSON string
      try {
        return JSON.stringify(value);
      } catch (e) {
        return fallback;
      }
    }
    
    return String(value);
  };

  // Function khusus untuk topup option
  const getTopupOptionDisplay = (order) => {
    const topupOption = order.topup_option || order.package_name || order.topup_id;
    
    if (!topupOption) return 'N/A';
    
    // Jika topupOption adalah object
    if (typeof topupOption === 'object') {
      // Coba ambil code terlebih dahulu
      if (topupOption.code) {
        return topupOption.code;
      }
      // Kemudian coba ambil name
      if (topupOption.name) {
        return topupOption.name;
      }
      // Kemudian coba ambil id
      if (topupOption.id) {
        return topupOption.id;
      }
      // Jika tidak ada, tampilkan JSON
      try {
        return JSON.stringify(topupOption);
      } catch (e) {
        return 'Invalid Object';
      }
    }
    
    return String(topupOption);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Status styling
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-sm';
      case 'success':
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm';
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-sm';
      default:
        return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-sm';
    }
  };

  return (
    <section className="p-4 space-y-8">
      {/* Orders Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        
        {ordersError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {ordersError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-3">Id</th>
                <th className="p-3">Topup Option</th>
                <th className="p-3">Jumlah Topup</th>
                <th className="p-3">Id User</th>
                <th className="p-3">ML User ID</th>
                <th className="p-3">Server ID</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {ordersLoading ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{safeDisplayValue(order.id)}</td>
                    <td className="p-3">{getTopupOptionDisplay(order)}</td>
                    <td className="p-3">{safeDisplayValue(order.jumlah_topup || order.quantity, '1')}</td>
                    <td className="p-3">{safeDisplayValue(order.user_id || order.userId)}</td>
                    <td className="p-3">{safeDisplayValue(order.ml_user_id || order.game_id)}</td>
                    <td className="p-3">{safeDisplayValue(order.server_id || order.serverId)}</td>
                    <td className="p-3">{safeDisplayValue(order.payment_method || order.paymentMethod)}</td>
                    <td className="p-3">
                      <span className={getStatusColor(order.status)}>
                        {safeDisplayValue(order.status, 'Unknown')}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(order.created_at || order.tanggal)}</td>
                    <td className="p-3 space-x-2">
                      <button 
                        onClick={() => handleEditOrder(order.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-gray-500">
                    {ordersError ? "Tidak dapat memuat data order" : "Tidak ada data order"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Table</h2>
        
        {paymentsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {paymentsError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg shadow-md">
            <thead className="bg-yellow-100 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status Pembayaran</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paymentsLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{safeDisplayValue(payment.id)}</td>
                    <td className="p-3">{safeDisplayValue(payment.order_id || payment.orderId)}</td>
                    <td className="p-3">
                      <span className="font-semibold text-gray-800">
                        {typeof payment.amount === 'number' 
                          ? formatCurrency(payment.amount)
                          : safeDisplayValue(payment.amount || payment.jumlah)
                        }
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={getStatusColor(payment.status || payment.payment_status)}>
                        {safeDisplayValue(payment.status || payment.payment_status, 'Unknown')}
                      </span>
                    </td>
                    <td className="p-3">{formatDate(payment.created_at || payment.tanggal)}</td>
                    <td className="p-3 space-x-2">
                      <button 
                        onClick={() => handleEditPayment(payment.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeletePayment(payment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    {paymentsError ? "Tidak dapat memuat data payment" : "Tidak ada data payment"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminOrder;