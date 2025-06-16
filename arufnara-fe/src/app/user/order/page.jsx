"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Diamond, User, CreditCard, Check, ArrowLeft, Zap } from "lucide-react";
import { getTopup } from "../../../_services/topup";
import { getOrderUser, createOrder } from "../../../_services/orders";
import { createPayment } from "../../../_services/payments";

export default function OrderPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    zoneId: "",
    email: "",
    customerName: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [vaNumber, setVaNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentFile, setPaymentFile] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const [diamondPackages, setDiamondPackages] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [createdOrder, setCreatedOrder] = useState(null);

  const staticPaymentMethods = [
  { id: "bca", name: "BCA", icon: "🏦", fee: 0 },
  { id: "bni", name: "BNI", icon: "🏦", fee: 0 },
  { id: "bri", name: "BRI", icon: "🏦", fee: 0 },
  { id: "mandiri", name: "Mandiri", icon: "🏦", fee: 0 },
  { id: "qris", name: "QRIS", icon: "🔳", fee: 0 },
  // Tambahkan metode lain sesuai kebutuhan
];

  useEffect(() => {
    getTopup()
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Data topup bukan array:", data);
          setDiamondPackages([]);
          return;
        }
        setDiamondPackages(
          data.map((item) => ({
            id: item.id,
            diamond_amount: item.diamond_amount,
            bonus_diamond: item.bonus_diamond,
            price: item.price,
          }))
        );
      })
      .catch((err) => {
        console.error("Gagal fetch topup:", err);
        setDiamondPackages([]);
      });
    getOrderUser()
      .then((orders) => {
        const uniqueMethods = [
          ...new Set(
            orders
              .map((order) => order.payment_method)
              .filter((pm) => pm && pm !== "")
          ),
        ].map((pm) => ({
          id: pm,
          name: pm.toUpperCase(),
          icon: "💳",
          fee: 0,
        }));
        setPaymentMethods(staticPaymentMethods);
      })
      .catch(() => setPaymentMethods([]));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getTotalPrice = () => {
    if (!selectedPackage) return 0;
    const method = paymentMethods.find((p) => p.id === paymentMethod);
    return selectedPackage.price + (method ? (method.fee || 0) : 0);
  };

  const handleFileChange = (e) => {
    setPaymentFile(e.target.files[0]);
  };

  // Ubah handlePay untuk createPayment
  const handlePay = async () => {
    if (!paymentFile) {
      alert("Silakan upload bukti pembayaran terlebih dahulu!");
      return;
    }
    if (!createdOrder) {
      alert("Pesanan belum dibuat!");
      return;
    }
    setIsPaying(true);

    // Simulasi upload file, jika backend support FormData, gunakan FormData
    // Untuk sekarang, proof_of_payment dikirim null atau string dummy
    const paymentData = {
      order_id: createdOrder.id,
      amount: createdOrder.total || selectedPackage.price,
      payment_status: "success", // atau "pending" jika perlu approval
      transaction_date: new Date().toISOString().slice(0, 19).replace("T", " "),
      proof_of_payment: null, // atau paymentFile jika backend support upload
    };

    try {
      await createPayment(paymentData);
      setIsPaying(false);
      alert("Pembayaran berhasil.");
      router.push(`/user/order/detail?orderId=${createdOrder.id}`);
    } catch (err) {
      setIsPaying(false);
      alert("Gagal membuat pembayaran!");
    }
  };

  // Ubah handleSubmit untuk createOrder
  const handleSubmit = async () => {
    if (!selectedPackage) {
      alert("Pilih paket diamond terlebih dahulu!");
      return;
    }
    if (!formData.userId || !formData.zoneId) {
      alert("User ID dan Zone ID harus diisi!");
      return;
    }
    if (!formData.email) {
      alert("Email harus diisi!");
      return;
    }
    if (!paymentMethod) {
      alert("Pilih metode pembayaran!");
      return;
    }
    if (!formData.customerName) {
      alert("Username harus diisi!");
      return;
    }

    setIsLoading(true);

    // Siapkan data order sesuai tabel orders
    const orderData = {
      topup_option_id: selectedPackage.id,
      ml_user_id: formData.userId,
      server_id: formData.zoneId,
      payment_method: paymentMethod,
      status: "pending",
    };

    try {
      const response = await createOrder(orderData);
      setIsLoading(false);
      setCreatedOrder({
        ...response.data,
        total: selectedPackage.price,
      });

      if (
        ["bca", "bni", "bri", "mandiri"].includes(paymentMethod)
      ) {
        setVaNumber(
          "88" + Math.floor(1000000000 + Math.random() * 9000000000)
        );
      }

      setShowConfirmation(true);
    } catch (err) {
      setIsLoading(false);
      alert("Gagal membuat pesanan!");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 transition-colors text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 text-3xl bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl">
              🎮
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white">Mobile Legends</h1>
              <p className="text-indigo-200">Top Up Diamond</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form User Data */}
          <div className="lg:col-span-1">
            <div className="p-6 mb-6 border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                <User className="w-5 h-5" />
                Data Akun Game
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="User ID"
                  className="w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none"
                />
                <input
                  type="text"
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={handleInputChange}
                  placeholder="Zone ID"
                  className="w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none"
                />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 text-white border rounded-lg bg-white/10 border-white/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Order Summary */}
            {selectedPackage && (
              <div className="p-6 border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
                <h3 className="mb-4 text-xl font-bold text-white">
                  Ringkasan Pesanan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Diamond:</span>
                    <span className="font-semibold text-white">
                      {selectedPackage.diamond_amount}
                      {selectedPackage.bonus_diamond > 0 && ` (+${selectedPackage.bonus_diamond})`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Harga:</span>
                    <span className="text-white">
                      {formatPrice(selectedPackage.price)}
                    </span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-yellow-400">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Package Selection */}
          <div className="lg:col-span-1">
            <div className="p-6 border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                <Diamond className="w-5 h-5" />
                Pilih Paket Diamond
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-96">
                {Array.isArray(diamondPackages) && diamondPackages.length > 0 ? (
                  diamondPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedPackage?.id === pkg.id
                          ? "bg-indigo-600/50 border-indigo-400"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {pkg.diamond_amount} 💎
                            </span>
                            {pkg.bonus_diamond > 0 && (
                              <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                                +{pkg.bonus_diamond}
                              </span>
                            )}
                          </div>
                          {pkg.bonus_diamond > 0 && (
                            <div className="text-sm text-white/60">
                              Total: {pkg.diamond_amount + pkg.bonus_diamond} Diamond
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">
                            {formatPrice(pkg.price)}
                          </div>
                          {selectedPackage?.id === pkg.id && (
                            <Check className="w-5 h-5 ml-auto text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/70">Tidak ada paket diamond tersedia</div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="lg:col-span-1">
            <div className="p-6 mb-6 border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
              <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">
                <CreditCard className="w-5 h-5" />
                Metode Pembayaran
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${paymentMethod === method.id
                        ? "bg-indigo-600/50 border-indigo-400"
                        : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{method.icon || "💳"}</span>
                        <span className="font-medium text-white">
                          {method.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.fee > 0 && (
                          <span className="text-sm text-white/60">
                            +{formatPrice(method.fee)}
                          </span>
                        )}
                        {paymentMethod === method.id && (
                          <Check className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={
                !selectedPackage ||
                !paymentMethod ||
                !formData.userId ||
                !formData.customerName ||
                isLoading
              }
              className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white transition-all duration-300 transform rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Zap className="w-5 h-5" />
              {isLoading ? "Memproses..." : "Buat Pesanan Sekarang"}
            </button>

            {/* Konfirmasi Pembayaran */}
            {showConfirmation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                <div className="relative w-full max-w-md p-8 text-center border-indigo-400 shadow-lg bg-indigo-600/50 rounded-2xl">
                  {/* Tombol X di pojok kanan atas pop up */}
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="absolute text-2xl font-bold top-4 right-4 text-white/80 hover:text-white focus:outline-none"
                    aria-label="Tutup"
                    type="button"
                  >
                    ×
                  </button>
                  <h2 className="gap-2 mb-4 text-xl font-bold text-white">
                    Pembayaran
                  </h2>
                  {["bca", "bni", "bri", "mandiri"].includes(paymentMethod) ? (
                    <div>
                      <p className="mb-2 text-white">
                        Silakan bayar ke nomor VA berikut:
                      </p>
                      <div className="p-3 mb-4 font-mono text-lg bg-gray-100 rounded-md">
                        {vaNumber}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-white">
                        Scan QR berikut untuk melakukan pembayaran:
                      </p>
                      <div className="flex items-center justify-center w-40 h-40 mx-auto text-sm bg-gray-300 rounded-md">
                        QR Code
                      </div>
                    </div>
                  )}
                  {/* Upload Form */}
                  <div className="mt-4">
                    <label className="block mb-2 font-medium text-left text-white">
                      Upload Bukti Pembayaran
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full mb-4 text-white"
                    />
                    <button
                      onClick={handlePay}
                      disabled={isPaying || !paymentFile}
                      className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isPaying ? "Memproses..." : "Bayar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}