"use client"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { registerUser } from "../_services/auth"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "user") {
        router.push("/user")
      }
    }
  }, [router])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("") // Clear error when input changes
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi form
    if (!formData.username || !formData.email || !formData.password) {
      setError("Mohon lengkapi semua data")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok!")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })

      // Show success message
      alert("Registrasi berhasil! Silakan login.")

      // Redirect to login page
      router.push("/login")
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

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
            <h2 className="mb-2 text-2xl font-bold text-white">Buat Akun Baru</h2>
            <p className="text-indigo-200">Daftar untuk mulai top up</p>
          </div>

          {error && <div className="p-3 mb-4 text-sm text-white rounded-lg bg-red-500/20">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
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
                  required
                />
              </div>
            </div>

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
                  required
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
                  required
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

            {/* Confirm Password */}
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
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full gap-2 py-3 text-lg font-bold text-white transition-all duration-300 transform bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Memproses..." : "Daftar"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>

            {/* Toggle Mode */}
            <div className="pt-4 text-center border-t border-white/20">
              <p className="mb-2 text-white/80">Sudah punya akun?</p>
              <Link href="/login" className="font-semibold text-indigo-300 transition-colors hover:text-indigo-200">
                Masuk di sini
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-center text-white/60">
          <p>Dengan mendaftar, kamu setuju dengan</p>
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
