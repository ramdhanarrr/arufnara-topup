<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Point;
use Illuminate\Support\Facades\DB;

class AdminOrderController extends Controller
{
    // 1. Ambil semua transaksi
    public function index()
    {
        $orders = Order::with(['user', 'topupOption'])->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    // 2. Lihat detail transaksi
    public function show($id)
    {
        $order = Order::with(['user', 'topupOption'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }

    // 3. Update status transaksi dan beri poin jika paid
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:paid,failed'
        ]);

        DB::transaction(function () use ($request, $id) {
            $order = Order::with(['topupOption', 'user'])->findOrFail($id);
            $order->status = $request->status;
            $order->save();

            // Jika berhasil, beri poin
            if ($request->status === 'paid') {
                $point = Point::firstOrCreate(['user_id' => $order->user->id]);
                $totalDiamond = $order->topupOption->diamond_amount + $order->topupOption->bonus_diamond;
                $point->total_point += $totalDiamond;
                $point->save();
            }
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Status updated successfully'
        ]);
    }
}
