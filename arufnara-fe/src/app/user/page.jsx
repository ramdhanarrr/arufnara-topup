"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getOrderUser } from "../../_services/orders"
import { getPaymentByOrder } from "../../_services/payments"
import dayjs from 'dayjs'
import {
    History,
    Coins,
    ShoppingBag,
    Settings,
    LogOut,
    ChevronRight,
    Calendar,
    Wallet,
} from "lucide-react"

export default function UserDashboard() {
    const router = useRouter()
    const [filterStatus, setFilterStatus] = useState("all")
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [user, setUser] = useState({
        name: "",
        points: 0,
        totalSpent: 0,
        totalTransactions: 0,
    })

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")

        if (!token || !userStr) {
            router.replace("/auth/login")
            return
        }

        const parsedUser = JSON.parse(userStr)
        setUser((prev) => ({
            ...prev,
            name: parsedUser.name || "",
        }))

        setLoading(true)
        getOrderUser()
            .then(async (orders) => {
                const trxPromises = orders.map(async (order) => {
                    try {
                        const payment = await getPaymentByOrder(order.id)
                        return {
                            id: order.id,
                            tanggal: dayjs(order.created_at).format("DD MMM YYYY HH:mm"),
                            total_bayar: parseFloat(payment.amount) || 0,
                            bonus_diamond: payment.order_details?.bonus_diamond || 0,
                            status_bayar: payment.payment_status || "pending",
                            event: order.game_name || "Transaksi Game",
                            item: order.item_name || "Diamond",
                        }
                    } catch {
                        return {
                            id: order.id,
                            tanggal: dayjs(order.created_at).format("DD MMM YYYY HH:mm"),
                            total_bayar: 0,
                            bonus_diamond: 0,
                            status_bayar: "pending",
                            event: order.game_name || "Transaksi Game",
                            item: order.item_name || "Diamond",
                        }
                    }
                })

                const merged = await Promise.all(trxPromises)
                setTransactions(merged)
                setError(null)

                // Update user stats
                const totalSpent = merged.reduce((sum, t) => sum + t.total_bayar, 0)
                const totalTransactions = merged.length
                const points = Math.floor(totalSpent / 1000)

                setUser((prev) => ({
                    ...prev,
                    points,
                    totalSpent,
                    totalTransactions,
                }))
            })
            .catch((err) => {
                setError("Gagal mengambil data transaksi: " + err.message)
                setTransactions([])
            })
            .finally(() => setLoading(false))
    }, [router])

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
            case "paid":
                return "bg-green-500/20 text-green-400"
            case "pending":
                return "bg-yellow-500/20 text-yellow-400"
            case "failed":
                return "bg-red-500/20 text-red-400"
            default:
                return "bg-gray-500/20 text-gray-400"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "success":
            case "paid":
                return "Berhasil"
            case "pending":
                return "Pending"
            case "failed":
                return "Gagal"
            default:
                return "Unknown"
        }
    }

    const handleLogout = () => {
        if (confirm("Apakah Anda yakin ingin keluar?")) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            router.push("/auth/login")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
                <div className="text-lg text-white">Memuat data ...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            <div className="border-b bg-white/10 backdrop-blur-lg border-white/20">
                <div className="max-w-6xl px-4 py-6 mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Hi, {user.name}!</h1>
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
                                <p className="text-2xl font-bold text-white">{user.points}</p>
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
                                <p className="text-2xl font-bold text-white">Rp {user.totalSpent.toLocaleString('id-ID').split(",")[0]}</p>
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
                                <p className="text-2xl font-bold text-white">{user.totalTransactions}</p>
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
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
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
                                                        <p className="text-xs text-white/50">{transaction.tanggal}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-white">{transaction.total_bayar.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                                                <p className="text-sm text-green-400">
                                                    {transaction.bonus_diamond > 0 ? `+${transaction.bonus_diamond} diamonds` : "-"}
                                                </p>
                                                <span className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${getStatusColor(transaction.status_bayar)}`}>
                                                    {getStatusText(transaction.status_bayar)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-white/70">Tidak ada transaksi ditemukan.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}