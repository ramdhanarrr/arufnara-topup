"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    History,
    Coins,
    Trophy,
    ShoppingBag,
    Settings,
    LogOut,
    ChevronRight,
    Star,
    Calendar,
    Wallet,
} from "lucide-react"

export default function UserDashboard() {
    const router = useRouter()
    const [userData, setUserData] = useState({
        name: "Arkanaeru",
        email: "arkanaeru@email.com",
        avatar: "/placeholder.svg?height=80&width=80",
        points: 15750,
        totalSpent: 2450000,
        totalTransactions: 23,
    })

    const [recentTransactions, setRecentTransactions] = useState([
        {
            id: 1,
            event: "Collab ML x Attack on Titan",
            item: "Weekly Diamond Pass",
            amount: 85000,
            diamonds: 875,
            date: "2024-01-15",
            status: "success",
        },
        {
            id: 2,
            event: "Event Diamond Bonus ML",
            item: "Monthly Membership",
            amount: 65000,
            diamonds: 720,
            date: "2024-01-12",
            status: "success",
        },
        {
            id: 3,
            event: "Pre-Order Skin Starlight",
            item: "UC 1800",
            amount: 450000,
            diamonds: 1800,
            date: "2024-01-10",
            status: "success",
        },
    ])

    const handleLogout = () => {
        if (confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            {/* Header */}
            <div className="border-b bg-white/10 backdrop-blur-lg border-white/20">
                <div className="max-w-6xl px-4 py-6 mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={userData.avatar || "/placeholder.svg"}
                                alt="Profile"
                                className="w-16 h-16 border-2 rounded-full border-white/30"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                                <p className="text-indigo-200">{userData.level}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-white transition-colors border rounded-lg bg-white/10 border-white/30 hover:bg-white/20"
                        >
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl px-4 py-8 mx-auto">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                    <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-yellow-500/20">
                                <Coins className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Total Points</p>
                                <p className="text-2xl font-bold text-white">{userData.points.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-500/20">
                                <Wallet className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Total Belanja</p>
                                <p className="text-2xl font-bold text-white">Rp {userData.totalSpent.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/20">
                                <ShoppingBag className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Total Transaksi</p>
                                <p className="text-2xl font-bold text-white">{userData.totalTransactions}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="p-6 mb-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                            <h3 className="mb-4 text-xl font-bold text-white">Menu Utama</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/user/history")}
                                    className="flex items-center justify-between w-full p-3 text-white transition-colors border rounded-lg bg-white/10 hover:bg-white/20 border-white/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <History className="w-5 h-5" />
                                        Riwayat Pembelian
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => router.push("/user/profile")}
                                    className="flex items-center justify-between w-full p-3 text-white transition-colors border rounded-lg bg-white/10 hover:bg-white/20 border-white/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5" />
                                        Edit Profile
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => router.push("/user/order")}
                                    className="flex items-center justify-between w-full p-3 text-white transition-colors rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-5 h-5" />
                                        Top Up Sekarang
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Achievements */}
                        
                    </div>

                    {/* Recent Transactions */}
                    <div className="lg:col-span-2">
                        <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Transaksi Terbaru</h3>
                                <button
                                    onClick={() => router.push("/user/history")}
                                    className="text-indigo-300 transition-colors hover:text-indigo-200"
                                >
                                    Lihat Semua
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-lg bg-green-500/20">
                                                <ShoppingBag className="w-5 h-5 text-green-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{transaction.event}</p>
                                                <p className="text-sm text-white/70">{transaction.item}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="w-3 h-3 text-white/50" />
                                                    <p className="text-xs text-white/50">{transaction.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white">Rp {transaction.amount.toLocaleString()}</p>
                                            <p className="text-sm text-green-400">+{transaction.diamonds} diamonds</p>
                                            <span className="inline-block px-2 py-1 mt-1 text-xs text-green-400 rounded-full bg-green-500/20">
                                                Berhasil
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
