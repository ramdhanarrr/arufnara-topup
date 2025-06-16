"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getOrderUser } from "../../../_services/orders"
import { getPaymentByOrder } from "../../../_services/payments"
import { ArrowLeft } from 'lucide-react'
import dayjs from "dayjs"

export default function HistoryPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.replace("/auth/login")
            return
        }
        setLoading(true)
        getOrderUser()
            .then(async (orders) => {
                // Untuk setiap order, ambil payment-nya
                const trxPromises = orders.map(async (order) => {
                    try {
                        const payment = await getPaymentByOrder(order.id)
                        return {
                            id: order.id,
                            tanggal: dayjs(order.created_at).format("DD MMM YYYY HH:mm"),
                            total_bayar: payment.amount || 0,
                            bonus_diamond: payment.order_details?.bonus_diamond || 0,
                            status_bayar: payment.payment_status || "pending",
                        }
                    } catch {
                        // Jika payment tidak ditemukan, tetap tampilkan order
                        return {
                            id: order.id,
                            tanggal: dayjs(order.created_at).format("DD MMM YYYY HH:mm"),
                            total_bayar: 0,
                            bonus_diamond: 0,
                            status_bayar: "pending",
                        }
                    }
                })
                const merged = await Promise.all(trxPromises)
                setTransactions(merged)
                setError(null)
            })
            .catch((err) => {
                setError("Gagal mengambil data transaksi: " + (err.message || "Unknown error"))
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

    // Filter transaksi sesuai pencarian dan status
    const normalizedSearch = searchTerm.trim()

    const filteredTransactions = transactions.filter((transaction) => {
        // Hanya ambil angka dari input pencarian
        const searchOnlyNumber = normalizedSearch.replace(/\D/g, "")
        
        // Cocokkan ID transaksi
        const idMatch = `TRX00${transaction.id}`.includes(normalizedSearch.toUpperCase())
        // Cocokkan tanggal transaksi
        const tanggalMatch = (transaction.tanggal || "").toLowerCase().includes(normalizedSearch.toLowerCase())

        // Filter status
        const matchesFilter = filterStatus === "all" || transaction.status_bayar === filterStatus

        return (idMatch || tanggalMatch) && matchesFilter
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            {/* Header dengan Tombol Kembali */}
            <div className="border-b bg-white/10 backdrop-blur-lg border-white/20">
                <div className="max-w-6xl px-4 py-6 mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 text-white transition-colors rounded-lg hover:bg-white/10"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Riwayat Pembelian</h1>
                            <p className="text-indigo-200">Lihat semua transaksi Anda</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl px-4 py-8 mx-auto">
                {/* Search and Filter */}
                <div className="flex flex-col gap-4 mb-6 md:flex-row">
                    <input
                        type="text"
                        placeholder="Cari ID atau tanggal transaksi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-4 pr-4 text-white border rounded-lg bg-white/10 border-white/30 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 text-white border rounded-lg bg-white/10 border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="all">Semua Status</option>
                        <option value="success">Berhasil</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Gagal</option>
                        <option value="paid">Berhasil</option>
                    </select>
                </div>
                {/* Transaction List */}
                <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                    {loading ? (
                        <div className="py-12 text-center text-white">Loading...</div>
                    ) : error ? (
                        <div className="py-12 text-center text-red-400">{error}</div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="py-12 text-center text-white/70">Tidak ada transaksi ditemukan</div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTransactions.map((trx) => (
                                <div key={trx.id} className="p-4 border rounded-lg bg-white/5 border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-white">ID: TRX00{trx.id}</p>
                                            <p className="text-sm text-white/70">{trx.tanggal}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trx.status_bayar)}`}>
                                            {getStatusText(trx.status_bayar)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                                        <div>
                                            <p className="text-white/50">Total Bayar</p>
                                            <p className="font-bold text-white">Rp {trx.total_bayar.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/50">Bonus Diamond</p>
                                            <p className="font-medium text-green-400">
                                                {trx.bonus_diamond > 0 ? `+${trx.bonus_diamond} diamonds` : "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-white/50">Status Bayar</p>
                                            <p className="font-medium text-white">{getStatusText(trx.status_bayar)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}