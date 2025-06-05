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
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/20 backdrop-blur-lg">
                        <img src="/logo.png" alt="logo" className="object-contain w-10 h-10" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-white">ARUFNARA</h1>
                    <p className="text-indigo-200">Top up game favoritmu dengan mudah</p>
                </div>

                {/* Form Container */}
                <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-white">
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
                                <label className="block font-medium text-white">Username</label>
                                <div className="relative">
                                    <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/70" />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full py-3 pl-12 pr-4 text-white border bg-white/20 border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        placeholder="Masukkan username"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block font-medium text-white">Email</label>
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/70" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full py-3 pl-12 pr-4 text-white border bg-white/20 border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    placeholder="nama@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block font-medium text-white">Password</label>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/70" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full py-3 pl-12 pr-12 text-white border bg-white/20 border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute transform -translate-y-1/2 right-3 top-1/2 text-white/70 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (hanya untuk register) */}
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="block font-medium text-white">Konfirmasi Password</label>
                                <div className="relative">
                                    <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-white/70" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full py-3 pl-12 pr-4 text-white border bg-white/20 border-white/30 rounded-xl placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                        placeholder="Ulangi password"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password (hanya untuk login) */}
                        {isLogin && (
                            <div className="text-right">
                                <button className="text-sm text-indigo-300 transition-colors hover:text-indigo-200">
                                    Lupa password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className="flex items-center justify-center w-full gap-2 py-3 text-lg font-bold text-white transition-all duration-300 transform bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 hover:scale-105"
                        >
                            {isLogin ? 'Masuk' : 'Daftar'}
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        {/* Toggle Mode */}
                        <div className="pt-4 text-center border-t border-white/20">
                            <p className="mb-2 text-white/80">
                                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                            </p>
                            <button
                                onClick={toggleMode}
                                className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
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

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <button className="flex items-center justify-center px-4 py-2 text-white transition-colors border bg-white/10 border-white/20 rounded-xl hover:bg-white/20">
                                    <span className="mr-2">
                                        <img src="/sosmed-01.png" alt="" />
                                        </span>
                                    Google
                                </button>
                                <button className="flex items-center justify-center px-4 py-2 text-white transition-colors border bg-white/10 border-white/20 rounded-xl hover:bg-white/20">
                                    <span className="mr-2">
                                        <img src="/sosmed-02.png" alt="" />
                                        </span>
                                    Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-sm text-center text-white/60">
                    <p>Dengan masuk, kamu setuju dengan</p>
                    <div className="flex justify-center gap-4 mt-1">
                        <button className="transition-colors hover:text-white/80">Syarat & Ketentuan</button>
                        <span>•</span>
                        <button className="transition-colors hover:text-white/80">Kebijakan Privasi</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;