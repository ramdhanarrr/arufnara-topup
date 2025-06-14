"use client"
import { useState } from "react"
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    })
    const router = useRouter()

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.email && formData.password && formData.username) {
            if (formData.password !== formData.confirmPassword) {
                alert("Password tidak cocok!")
                return
            }
            try {
                const response = await fetch("http://localhost:8000/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        username: formData.username,
                    }),
                })
                const data = await response.json()
                if (!response.ok) throw new Error(data.message || "Registrasi gagal")
                alert("Registrasi berhasil! Silakan login.")
                router.push("/auth/login")
            } catch (err) {
                alert("Error: " + err.message)
            }
        } else {
            alert("Mohon lengkapi semua data")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            <div className="w-full max-w-md">
                {/* ... Logo & Title ... */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-white/20 backdrop-blur-lg">
                        <img src="/logo.png" alt="logo" className="object-contain w-10 h-10" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-white">ARUFNARA</h1>
                    <p className="text-indigo-200">Top up game favoritmu dengan mudah</p>
                </div>
                <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl border-white/20">
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-white">Buat Akun Baru</h2>
                        <p className="text-indigo-200">Daftar untuk mulai top up</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full gap-2 py-3 text-lg font-bold text-white transition-all duration-300 transform bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 hover:scale-105"
                        >
                            Daftar
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="pt-4 text-center border-t border-white/20">
                            <p className="mb-2 text-white/80">Sudah punya akun?</p>
                            <button
                                type="button"
                                onClick={() => router.push("/auth/login")}
                                className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
                            >
                                Masuk di sini
                            </button>
                        </div>
                    </form>
                </div>
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
    )
}