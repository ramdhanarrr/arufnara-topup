"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User, Mail } from "lucide-react";
import { getUserProfile, editUserProfile } from "../../../_services/users";

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        username: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ambil data user dari backend
        getUserProfile()
            .then((data) => {
                setProfileData({
                    name: data.name || "",
                    email: data.email || "",
                    username: data.username || "",
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleProfileChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveProfile = async () => {
        try {
            await editUserProfile(profileData);
            alert("Profile berhasil diperbarui!");
            setIsEditing(false);
        } catch {
            alert("Gagal memperbarui profile!");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
                <div className="text-lg text-white">Memuat data profil...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            {/* Header */}
            <div className="border-b bg-white/10 backdrop-blur-lg border-white/20">
                <div className="max-w-4xl px-4 py-6 mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 text-white transition-colors rounded-lg hover:bg-white/10"
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

            <div className="max-w-4xl px-4 py-8 mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
                    {/* Profile Information */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Personal Information */}
                        <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Informasi Pribadi</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 text-white transition-colors border rounded-lg bg-white/10 border-white/30 hover:bg-white/20"
                                >
                                    {isEditing ? "Batal" : "Edit"}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 text-sm text-white/70">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-white/50" />
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => handleProfileChange("name", e.target.value)}
                                                disabled={!isEditing}
                                                placeholder={profileData.name}
                                                className="w-full py-2 pl-10 pr-4 text-white border rounded-lg bg-white/10 border-white/30 placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-white/70">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-white/50" />
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => handleProfileChange("email", e.target.value)}
                                                disabled={!isEditing}
                                                placeholder={profileData.email}
                                                className="w-full py-2 pl-10 pr-4 text-white border rounded-lg bg-white/10 border-white/30 placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm text-white/70">Username</label>
                                        <div className="relative">
                                            <User className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-white/50" />
                                            <input
                                                type="text"
                                                value={profileData.username}
                                                onChange={(e) => handleProfileChange("username", e.target.value)}
                                                disabled={!isEditing}
                                                placeholder={profileData.username}
                                                className="w-full py-2 pl-10 pr-4 text-white border rounded-lg bg-white/10 border-white/30 placeholder-white/50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="flex items-center gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                        >
                                            <Save className="w-4 h-4" />
                                            Simpan Perubahan
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-white transition-colors border rounded-lg bg-white/10 border-white/30 hover:bg-white/20"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}