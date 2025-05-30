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
                alert('Pembayaran berhasil. Kamu akan diarahkan ke halaman utama.');
                router.push('/');
            }, 4000);

        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <button className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Kembali
                    </button>
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl">
                            🎮
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl font-bold text-white">Mobile Legends</h1>
                            <p className="text-indigo-200">Top Up Diamond</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form User Data */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Data Akun Game
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-white/80 text-sm mb-2">User ID</label>
                                        <input
                                            type="text"
                                            name="userId"
                                            value={formData.userId}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="User ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/80 text-sm mb-2">Zone ID</label>
                                        <input
                                            type="text"
                                            name="zoneId"
                                            value={formData.zoneId}
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            placeholder="Zone ID"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm mb-2">Username</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        {selectedPackage && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold text-white mb-4">Ringkasan Pesanan</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-white/80">Diamond:</span>
                                        <span className="text-white font-semibold">
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
                                    <div className="flex justify-between font-bold text-lg">
                                        <span className="text-white">Total:</span>
                                        <span className="text-yellow-400">{formatPrice(getTotalPrice())}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Package Selection */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Diamond className="w-5 h-5" />
                                Pilih Paket Diamond
                            </h3>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {diamondPackages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${selectedPackage?.id === pkg.id
                                            ? 'bg-indigo-600/50 border-indigo-400'
                                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                                            } ${pkg.popular ? 'ring-2 ring-yellow-400/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold">
                                                        {pkg.diamond} 💎
                                                    </span>
                                                    {pkg.bonus && (
                                                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                                            +{pkg.bonus}
                                                        </span>
                                                    )}
                                                    {pkg.popular && (
                                                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                                                            Popular
                                                        </span>
                                                    )}
                                                </div>
                                                {pkg.bonus && (
                                                    <div className="text-white/60 text-sm">
                                                        Total: {pkg.diamond + pkg.bonus} Diamond
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-bold">
                                                    {formatPrice(pkg.price)}
                                                </div>
                                                {selectedPackage?.id === pkg.id && (
                                                    <Check className="w-5 h-5 text-green-400 ml-auto" />
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
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
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
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{method.icon}</span>
                                                <span className="text-white font-medium">{method.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {method.fee > 0 && (
                                                    <span className="text-white/60 text-sm">
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
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" />
                            Buat Pesanan Sekarang
                        </button>

                        {/* Konfirmasi Pembayaran */}
                        {showConfirmation && (
                            <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
                                    <h2 className="text-xl font-bold mb-4">Pembayaran</h2>
                                    {['bca', 'bni', 'bri', 'mandiri'].includes(paymentMethod) ? (
                                        <div>
                                            <p className="mb-2">Silakan bayar ke nomor VA berikut:</p>
                                            <div className="bg-gray-100 text-lg font-mono p-3 rounded-md mb-4">
                                                {vaNumber}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="mb-2">Scan QR berikut untuk melakukan pembayaran:</p>
                                            <div className="w-40 h-40 mx-auto bg-gray-300 rounded-md flex items-center justify-center text-sm">
                                                QR Code
                                            </div>
                                        </div>
                                    )}
                                    <p className="mt-4 text-green-600 font-semibold">Pembayaran berhasil!</p>
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