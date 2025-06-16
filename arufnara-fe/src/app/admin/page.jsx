'use client';
// app/admin/page.jsx
import React, { useState, useEffect } from "react";
import API from '../../_api';


import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Contoh data statis
const data = [
  { month: 'Jan', users: 400, orders: 240 },
  { month: 'Feb', users: 300, orders: 139 },
  { month: 'Mar', users: 500, orders: 380 },
  { month: 'Apr', users: 700, orders: 390 },
  { month: 'May', users: 1000, orders: 600 },
  { month: 'Jun', users: 1200, orders: 800 },
  { month: 'Jul', users: 1200, orders: 800 },
  { month: 'Aug', users: 1200, orders: 800 },
  { month: 'Sep', users: 1200, orders: 800 },
  { month: 'Oct', users: 1200, orders: 800 },
  { month: 'Nov', users: 1200, orders: 800 },
  { month: 'Dec', users: 1200, orders: 800 },
];

const AdminDashboard = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/admin/orders', getAuthConfig());
        const fetchedOrders = extractData(res);
        setOrders(fetchedOrders);

        // Generate chart data by month
        const countByMonth = {};

        fetchedOrders.forEach(order => {
          if (!order.created_at) return;

          const date = new Date(order.created_at);
          const month = date.toLocaleString('default', { month: 'short' });
          countByMonth[month] = (countByMonth[month] || 0) + 1;
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedChartData = months.map(month => ({
          month,
          orders: countByMonth[month] || 0,
        }));

        setChartData(formattedChartData);
      } catch (err) {
        console.error('Gagal mengambil data order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  
  return (
    <div className="py-10 bg-white dark:bg-dark text-black dark:text-white">
    
    <div className="py-10 bg-white dark:bg-dark text-black dark:text-white">
      <div className="p-6">
        <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">User & Order Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    
    <div className="p-4">
      <div className="mt-12">
        
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
          <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
            <div className="relative bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
              <div>
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 mb-1">
                  Incoming Order
                </h6>
              </div>
            </div>
            <div className="p-6 px-0 pt-0 pb-2 overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Id
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        TopUp Option
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Jumlah TopUp
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Id User
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Payment Method
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Status
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Tanggal
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6">Loading orders...</td>
                  </tr>
                  ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">Tidak ada data order</td>
                  </tr>
                  ) : (
                      orders.map((order, index) => {
                        const opt = order.topup_option;
                        const jumlah = opt?.diamond_amount || opt?.amount || '-';
                        const metode = order.payment_method || '-';
                        const tanggal = order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : '-';
                        return (
                          <tr key={order.id || order._id}>
                            <td className="py-3 px-5 border-b">{order.id || order._id}</td>
                            <td className="py-3 px-5 border-b">{opt?.id || '-'}</td>
                            <td className="py-3 px-5 border-b">{jumlah}</td>
                            <td className="py-3 px-5 border-b">{order.user_id || '-'}</td>
                            <td className="py-3 px-5 border-b">{metode}</td>
                            <td className="py-3 px-5 border-b capitalize">{order.status || '-'}</td>
                            <td className="py-3 px-5 border-b">{tanggal}</td>
                        </tr>
                        );
                      })
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
};

export default AdminDashboard;
