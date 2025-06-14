"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Save, Eye, EyeOff, User, Mail, Phone, Calendar, MapPin, Shield } from "lucide-react"

export default function ProfilePage() {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [profileData, setProfileData] = useState({
        name: "Ahmad Rizki",
        email: "ahmad.rizki@email.com",
        phone: "+62 812-3456-7890",
        birthDate: "1995-08-15",
        address: "Jakarta Selatan, DKI Jakarta",
        avatar: "/placeholder.svg?height=120&width=120",
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const handleProfileChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSaveProfile = () => {
        alert("Profile berhasil diperbarui!")
        setIsEditing(false)
    }

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Password baru dan konfirmasi password tidak cocok!")
            return
        }
        if (passwordData.newPassword.length < 6) {
            alert("Password baru minimal 6 karakter!")
            return
        }
        alert("Password berhasil diubah!")
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const handleAvatarChange = () => {
        alert("Fitur upload foto akan segera tersedia!")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                            <p className="text-indigo-200">Kelola informasi akun Anda</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white text-center mb-6">Foto Profile</h3>
                            <div className="text-center">
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={profileData.avatar || "/placeholder.svg"}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full border-4 border-white/30 object-cover"
                                    />
                                    <button
                                        onClick={handleAvatarChange}
                                        className="absolute bottom-0 right-0 p-2 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-white/70 text-sm mb-4">Klik ikon kamera untuk mengubah foto profile</p>
                                <button
                                    onClick={handleAvatarChange}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-colors mx-auto"
                                >
                                    <Camera className="w-4 h-4" />
                                    Ubah Foto
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Informasi Pribadi</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    {isEditing ? "Batal" : "Edit"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/70 text-sm mb-2">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => handleProfileChange("name", e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/70 text-sm mb-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileChange("email", e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/70 text-sm mb-2">Nomor Telepon</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                            <input
                                                type="text"
                                                value={profileData.phone}
                                                onChange={(e) => handleProfileChange("phone", e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/70 text-sm mb-2">Tanggal Lahir</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                            <input
                                                type="date"
                                                value={profileData.birthDate}
                                                onChange={(e) => handleProfileChange("birthDate", e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Alamat</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                                        <textarea
                                            value={profileData.address}
                                            onChange={(e) => handleProfileChange("address", e.target.value)}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 disabled:opacity-50 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Simpan Perubahan
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                                <Shield className="w-5 h-5" />
                                Ubah Password
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Password Saat Ini</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                            placeholder="Masukkan password saat ini"
                                            className="w-full pr-10 pl-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                            placeholder="Masukkan password baru"
                                            className="w-full pr-10 pl-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Konfirmasi Password Baru</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                            placeholder="Ulangi password baru"
                                            className="w-full pr-10 pl-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Shield className="w-4 h-4" />
                                    Ubah Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
