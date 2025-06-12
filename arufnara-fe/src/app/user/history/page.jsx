"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Filter, ShoppingBag, Download, Eye } from 'lucide-react'

export default function HistoryPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")

    const [transactions, setTransactions] = useState([
        {
            id: "TRX001",
            event: "Collab ML x Attack on Titan",
            item: "Weekly Diamond Pass",
            amount: 85000,
            diamonds: 875,
            date: "2024-01-15",
            time: "14:30",
            status: "success",
            paymentMethod: "GoPay",
        },
        {
            id: "TRX002",
            event: "Event Diamond Bonus ML",
            item: "Monthly Membership",
            amount: 65000,
            diamonds: 720,
            date: "2024-01-12",
            time: "09:15",
            status: "success",
            paymentMethod: "OVO",
        },
        {
            id: "TRX003",
            event: "Event Diamond Bonus ML",
            item: "UC 1800",
            amount: 450000,
            diamonds: 1800,
            date: "2024-01-10",
            time: "16:45",
            status: "success",
            paymentMethod: "Bank Transfer",
        },
        {
            id: "TRX004",
            event: "Weekend Cashback Diamond",
            item: "Genesis Crystal 6480",
            amount: 1599000,
            diamonds: 6480,
            date: "2024-01-08",
            time: "20:22",
            status: "success",
            paymentMethod: "Credit Card",
        },
        {
            id: "TRX005",
            event: "MLBB All Star 2025",
            item: "VP 5350",
            amount: 799000,
            diamonds: 5350,
            date: "2024-01-05",
            time: "11:30",
            status: "pending",
            paymentMethod: "DANA",
        },
        {
            id: "TRX006",
            event: "MLBB All Star 2025",
            item: "Starlight Member",
            amount: 139000,
            diamonds: 0,
            date: "2024-01-03",
            time: "13:15",
            status: "failed",
            paymentMethod: "ShopeePay",
        },
    ])

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = filterStatus === "all" || transaction.status === filterStatus

        return matchesSearch && matchesFilter
    })

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
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
                return "Berhasil"
            case "pending":
                return "Pending"
            case "failed":
                return "Gagal"
            default:
                return "Unknown"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800">
            {/* Header */}
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
                <div className="p-6 mb-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-white/50" />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan event, item, atau ID transaksi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-white border rounded-lg bg-white/10 border-white/30 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 text-white border rounded-lg bg-white/10 border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="all">Semua Status</option>
                                <option value="success">Berhasil</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Gagal</option>
                            </select>
                            <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors border rounded-lg bg-white/10 border-white/30 hover:bg-white/20">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="p-6 border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Daftar Transaksi ({filteredTransactions.length})</h3>
                        <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors border rounded-lg bg-white/10 border-white/30 hover:bg-white/20">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 border rounded-lg bg-white/5 border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/20">
                                            <ShoppingBag className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{transaction.event}</p>
                                            <p className="text-sm text-white/70">{transaction.item}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                                    >
                                        {getStatusText(transaction.status)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                    <div>
                                        <p className="text-white/50">ID Transaksi</p>
                                        <p className="font-medium text-white">{transaction.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50">Tanggal & Waktu</p>
                                        <p className="text-white">{transaction.date}</p>
                                        <p className="text-white/70">{transaction.time}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50">Total Bayar</p>
                                        <p className="font-bold text-white">Rp {transaction.amount.toLocaleString()}</p>
                                        <p className="text-white/70">{transaction.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/50">Item Diterima</p>
                                        <p className="font-medium text-green-400">
                                            {transaction.diamonds > 0 ? `+${transaction.diamonds} diamonds` : "Membership"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button className="flex items-center gap-2 px-3 py-1 text-indigo-300 transition-colors rounded-lg hover:text-indigo-200 hover:bg-white/10">
                                        <Eye className="w-4 h-4" />
                                        Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTransactions.length === 0 && (
                        <div className="py-12 text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-white/30" />
                            <p className="text-lg text-white/70">Tidak ada transaksi ditemukan</p>
                            <p className="text-white/50">Coba ubah kata kunci pencarian atau filter</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
