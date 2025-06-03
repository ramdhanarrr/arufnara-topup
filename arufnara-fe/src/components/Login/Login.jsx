"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';


const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLogin) {
            if (formData.email && formData.password) {
                alert('Login berhasil! Mengarahkan ke halaman top up...');
                router.push('/form'); // ⬅️ Tambahkan ini
            } else {
                alert('Mohon isi email dan password');
            }
        }
        else {
            // Simulasi register
            if (formData.email && formData.password && formData.confirmPassword && formData.username) {
                if (formData.password !== formData.confirmPassword) {
                    alert('Password tidak cocok!');
                    return;
                }
                alert('Registrasi berhasil! Silakan login.');
                setIsLogin(true);
                setFormData({ email: '', password: '', confirmPassword: '', username: '' });
            } else {
                alert('Mohon lengkapi semua data');
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ email: '', password: '', confirmPassword: '', username: '' });
    };

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4">
                        <span className="text-3xl">🎮</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">GameStore</h1>
                    <p className="text-indigo-200">Top up game favoritmu dengan mudah</p>
                </div>

                {/* Form Container */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {isLogin ? 'Masuk ke Akun' : 'Buat Akun Baru'}
                        </h2>
                        <p className="text-indigo-200">
                            {isLogin ? 'Masuk untuk melanjutkan top up' : 'Daftar untuk mulai top up'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Username (hanya untuk register) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        placeholder="Masukkan username"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-white font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-white font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-12 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (hanya untuk register) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="block text-white font-medium">Konfirmasi Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        placeholder="Ulangi password"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password (hanya untuk login) */}
                        {isLogin && (
                            <div className="text-right">
                                <button className="text-indigo-300 hover:text-indigo-200 text-sm transition-colors">
                                    Lupa password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            {isLogin ? 'Masuk' : 'Daftar'}
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        {/* Toggle Mode */}
                        <div className="text-center pt-4 border-t border-white/20">
                            <p className="text-white/80 mb-2">
                                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                            </p>
                            <button
                                onClick={toggleMode}
                                className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors"
                            >
                                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
                            </button>
                        </div>

                        {/* Social Login (opsional) */}
                        <div className="pt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-transparent text-white/70">atau masuk dengan</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                                    <span className="mr-2">📱</span>
                                    Google
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                                    <span className="mr-2">📘</span>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-white/60 text-sm">
                    <p>Dengan masuk, kamu setuju dengan</p>
                    <div className="flex justify-center gap-4 mt-1">
                        <button className="hover:text-white/80 transition-colors">Syarat & Ketentuan</button>
                        <span>•</span>
                        <button className="hover:text-white/80 transition-colors">Kebijakan Privasi</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;