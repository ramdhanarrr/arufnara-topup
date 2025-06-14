"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrderById } from "../../../../_services/orders"; // Perbaiki path import

export default function OrderDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
        <div className="text-lg text-white">Memuat detail pesanan...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
        <div className="text-lg text-white">Pesanan tidak ditemukan.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-4 transition-colors text-white/80 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
        <div className="p-6 border shadow-lg bg-white/10 border-white/20 rounded-2xl backdrop-blur-lg">
          <h1 className="mb-2 text-2xl font-bold text-white">Detail Pesanan</h1>
          <div className="mb-4 text-sm text-white/80">
            ID Pesanan: <span className="font-mono">{order.id}</span>
          </div>
          <div className="mb-4 text-sm text-white/80">
            Tanggal: {order.created_at ? new Date(order.created_at).toLocaleString("id-ID") : "-"}
          </div>
          <hr className="mb-4 border-white/20" />

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Data Akun</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <div>
                User ID:{" "}
                <span className="font-semibold text-white">
                  {order.ml_user_id}
                </span>
              </div>
              <div>
                Zone ID:{" "}
                <span className="font-semibold text-white">
                  {order.server_id}
                </span>
              </div>
              {/* Tambahkan email/username jika ada di order */}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Paket Diamond</h2>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span>
                {order.topup_option?.diamond_amount || "-"} 💎
              </span>
              {order.topup_option?.bonus_diamond > 0 && (
                <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                  +{order.topup_option.bonus_diamond}
                </span>
              )}
              <span className="ml-2 text-white">
                Harga:{" "}
                {(order.topup_option?.price || 0).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Metode Pembayaran</h2>
            <div className="text-sm text-white/80">
              {order.payment_method}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Status</h2>
            <div className="inline-block px-3 py-1 text-sm font-semibold text-black rounded-full bg-green-500/80">
              {order.status}
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={() => router.push("/user")}
              className="px-5 py-3 font-semibold text-white transition bg-green-600 rounded-lg shadow-lg hover:bg-indigo-700"
            >
              Lihat Riwayat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}