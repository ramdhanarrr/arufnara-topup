"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Diamond, User, Mail, Phone, CreditCard, Check, ArrowLeft, Zap } from 'lucide-react';

const Form = () => {
    const router = useRouter();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [formData, setFormData] = useState({
        userId: '',
        zoneId: '',
        email: '',
        whatsapp: '',
        customerName: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [vaNumber, setVaNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Data paket diamond ML
    const diamondPackages = [
        { id: 1, diamond: 86, price: 20000, popular: false },
        { id: 2, diamond: 172, price: 40000, popular: false },
        { id: 3, diamond: 257, price: 60000, popular: false },
        { id: 4, diamond: 344, price: 80000, popular: false },
        { id: 5, diamond: 429, price: 100000, popular: false },
        { id: 6, diamond: 514, price: 120000, popular: false },
        { id: 7, diamond: 600, price: 140000, popular: true, bonus: 50 },
        { id: 8, diamond: 706, price: 160000, popular: false, bonus: 60 },
        { id: 9, diamond: 878, price: 200000, popular: false, bonus: 90 },
        { id: 10, diamond: 963, price: 220000, popular: false, bonus: 100 },
        { id: 11, diamond: 1412, price: 320000, popular: false, bonus: 150 },
        { id: 12, diamond: 2195, price: 500000, popular: false, bonus: 250 }
    ];

    // Metode pembayaran
    const paymentMethods = [
        { id: 'dana', name: 'DANA', icon: '💳', fee: 0 },
        { id: 'ovo', name: 'OVO', icon: '🟣', fee: 0 },
        { id: 'gopay', name: 'GoPay', icon: '🟢', fee: 0 },
        { id: 'shopeepay', name: 'ShopeePay', icon: '🟠', fee: 0 },
        { id: 'bca', name: 'BCA Virtual Account', icon: '🏦', fee: 4000 },
        { id: 'bni', name: 'BNI Virtual Account', icon: '🏦', fee: 4000 },
        { id: 'bri', name: 'BRI Virtual Account', icon: '🏦', fee: 4000 },
        { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦', fee: 4000 }
    ];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getTotalPrice = () => {
        if (!selectedPackage) return 0;
        const method = paymentMethods.find(p => p.id === paymentMethod);
        return selectedPackage.price + (method ? method.fee : 0);
    };

    const handleSubmit = () => {
        // Validasi form
        if (!selectedPackage) {
            alert('Pilih paket diamond terlebih dahulu!');
            return;
        }
        if (!formData.userId || !formData.zoneId) {
            alert('User ID dan Zone ID harus diisi!');
            return;
        }
        if (!formData.email || !formData.whatsapp) {
            alert('Email dan WhatsApp harus diisi!');
            return;
        }
        if (!paymentMethod) {
            alert('Pilih metode pembayaran!');
            return;
        }
        if (!formData.customerName) {
            alert('username harus diisi!');
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);

            const orderData = {
                package: selectedPackage,
                userInfo: formData,
                payment: paymentMethods.find(p => p.id === paymentMethod),
                total: getTotalPrice(),
                orderId: 'ML' + Date.now()
            };

            alert(`Pesanan berhasil dibuat!\n\nOrder ID: ${orderData.orderId}\nDiamond: ${selectedPackage.diamond}\nTotal: ${formatPrice(getTotalPrice())}\n\nSilakan lakukan pembayaran.`);

            if (['bca', 'bni', 'bri', 'mandiri'].includes(paymentMethod)) {
                setVaNumber('88' + Math.floor(1000000000 + Math.random() * 9000000000));
            }

            setShowConfirmation(true);

            setTimeout(() => {
                alert('Pembayaran berhasil. Kamu akan diarahkan ke halaman user.');
                router.push('/user');
            }, 4000);

        }, 2000);
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <button className="flex items-center gap-2 mb-4 transition-colors text-white/80 hover:text-white">
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
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block mb-2 text-sm text-white/80">User ID</label>
                                        <input
                                            type="text"
                                            name="userId"
                                            value={formData.userId}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-white border rounded-lg bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="User ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-white/80">Zone ID</label>
                                        <input
                                            type="text"
                                            name="zoneId"
                                            value={formData.zoneId}
                                            onChange={handleInputChange}
                                            className="w-full p-3 text-white border rounded-lg bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="Zone ID"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-white/80">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 text-white border rounded-lg bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-white/80">WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full p-3 text-white border rounded-lg bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm text-white/80">Username</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 text-white border rounded-lg bg-white/20 border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        {selectedPackage && (
                            <div className="p-6 border bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
                                <h3 className="mb-4 text-xl font-bold text-white">Ringkasan Pesanan</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Diamond:</span>
                                        <span className="font-semibold text-white">
                                            {selectedPackage.diamond}
                                            {selectedPackage.bonus && ` (+${selectedPackage.bonus})`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Harga:</span>
                                        <span className="text-white">{formatPrice(selectedPackage.price)}</span>
                                    </div>
                                    {paymentMethod && paymentMethods.find(p => p.id === paymentMethod)?.fee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-white/80">Biaya Admin:</span>
                                            <span className="text-white">{formatPrice(paymentMethods.find(p => p.id === paymentMethod).fee)}</span>
                                        </div>
                                    )}
                                    <hr className="border-white/20" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-white">Total:</span>
                                        <span className="text-yellow-400">{formatPrice(getTotalPrice())}</span>
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
                                {diamondPackages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedPackage?.id === pkg.id
                                            ? 'bg-indigo-600/50 border-indigo-400'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                            } ${pkg.popular ? 'ring-2 ring-yellow-400/50' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white">
                                                        {pkg.diamond} 💎
                                                    </span>
                                                    {pkg.bonus && (
                                                        <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
                                                            +{pkg.bonus}
                                                        </span>
                                                    )}
                                                    {pkg.popular && (
                                                        <span className="px-2 py-1 text-xs font-bold text-black bg-yellow-500 rounded-full">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                {pkg.bonus && (
                                                    <div className="text-sm text-white/60">
                                                        Total: {pkg.diamond + pkg.bonus} Diamond
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
                                ))}
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
                                            ? 'bg-indigo-600/50 border-indigo-400'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{method.icon}</span>
                                                <span className="font-medium text-white">{method.name}</span>
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
                            disabled={!selectedPackage || !paymentMethod || !formData.userId || !formData.customerName}
                            className="flex items-center justify-center w-full gap-2 py-4 text-lg font-bold text-white transition-all duration-300 transform rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <Zap className="w-5 h-5" />
                            Buat Pesanan Sekarang
                        </button>

                        {/* Konfirmasi Pembayaran */}
                        {showConfirmation && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                                <div className="w-full max-w-md p-8 text-center bg-white shadow-lg rounded-2xl">
                                    <h2 className="mb-4 text-xl font-bold">Pembayaran</h2>
                                    {['bca', 'bni', 'bri', 'mandiri'].includes(paymentMethod) ? (
                                        <div>
                                            <p className="mb-2">Silakan bayar ke nomor VA berikut:</p>
                                            <div className="p-3 mb-4 font-mono text-lg bg-gray-100 rounded-md">
                                                {vaNumber}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="mb-2">Scan QR berikut untuk melakukan pembayaran:</p>
                                            <div className="flex items-center justify-center w-40 h-40 mx-auto text-sm bg-gray-300 rounded-md">
                                                QR Code
                                            </div>
                                        </div>
                                    )}
                                    <p className="mt-4 font-semibold text-green-600">Pembayaran berhasil!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Form;