<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    // Menampilkan semua data orders
    public function index()
    {
        $orders = Order::with(['user', 'topupOption'])->get();
        return response()->json($orders);
    }

    // Menyimpan data order baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'topup_option_id' => 'required|exists:topup_options,id',
            'server_id' => 'required|string',
            'payment_method' => 'required|string',
            'ml_user_id' => 'required|string',
            'status' => 'in:pending,paid,failed'
        ]);

        $order = Order::create($validated);
        return response()->json($order, 201);
    }

    // Menampilkan detail order berdasarkan ID
    public function show($id)
    {
        $order = Order::with(['user', 'topupOption'])->find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
    }

    // Mengupdate data order berdasarkan ID
    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'server_id' => 'sometimes|required|string',
            'payment_method' => 'sometimes|required|string',
            'status' => 'in:pending,paid,failed'
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    // Menghapus data order berdasarkan ID
    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }
}