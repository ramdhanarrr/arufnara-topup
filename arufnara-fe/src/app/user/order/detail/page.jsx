"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function OrderDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Simulasi fetch data pesanan berdasarkan orderId
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Simulasi data, ganti dengan fetch ke backend jika sudah ada
    if (orderId) {
      setOrder({
        orderId,
        userInfo: {
          userId: "12345678",
          zoneId: "1234",
          email: "user@email.com",
          whatsapp: "08123456789",
          customerName: "UsernameML",
        },
        package: {
          diamond: 600,
          bonus: 50,
          price: 140000,
        },
        payment: {
          name: "DANA",
          fee: 0,
        },
        total: 140000,
        status: "Lunas",
        tanggal: new Date().toLocaleString("id-ID"),
      });
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
        <div className="text-lg text-white">Memuat detail pesanan...</div>
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
            ID Pesanan: <span className="font-mono">{order.orderId}</span>
          </div>
          <div className="mb-4 text-sm text-white/80">
            Tanggal: {order.tanggal}
          </div>
          <hr className="mb-4 border-white/20" />

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Data Akun</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <div>
                User ID:{" "}
                <span className="font-semibold text-white">
                  {order.userInfo.userId}
                </span>
              </div>
              <div>
                Zone ID:{" "}
                <span className="font-semibold text-white">
                  {order.userInfo.zoneId}
                </span>
              </div>
              <div>
                Email:{" "}
                <span className="font-semibold text-white">
                  {order.userInfo.email}
                </span>
              </div>
              <div>
                WhatsApp:{" "}
                <span className="font-semibold text-white">
                  {order.userInfo.whatsapp}
                </span>
              </div>
              <div>
                Username:{" "}
                <span className="font-semibold text-white">
                  {order.userInfo.customerName}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Paket Diamond</h2>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span>{order.package.diamond} 💎</span>
              {order.package.bonus && (
                <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                  +{order.package.bonus}
                </span>
              )}
              <span className="ml-2 text-white">
                Harga:{" "}
                {order.package.price.toLocaleString("id-ID", {
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
              {order.payment.name}{" "}
              {order.payment.fee > 0 && (
                <span>
                  ( +
                  {order.payment.fee.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                  )
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 font-semibold text-white">Total</h2>
            <div className="text-lg font-bold text-yellow-400">
              {order.total.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              })}
            </div>
          </div>

          <div className="mb-2">
            <h2 className="mb-2 font-semibold text-white">Status</h2>
            <div className="inline-block px-3 py-1 text-sm font-semibold text-black rounded-full bg-green-500/80">
              {order.status}
            </div>
          </div>
          {/* Button ke halaman user di kanan bawah dalam form */}
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
