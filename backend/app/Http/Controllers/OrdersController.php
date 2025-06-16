<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\TopupOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrdersController extends Controller
{
    // Menampilkan semua data orders
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with(['topupOption', 'payment'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

     public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'topup_option_id' => 'required|exists:topup_options,id',
            'ml_user_id' => 'required|string|max:50',
            'server_id' => 'required|string|max:10',
            'payment_method' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $topupOption = TopupOption::findOrFail($request->topup_option_id);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'topup_option_id' => $request->topup_option_id,
            'ml_user_id' => $request->ml_user_id,
            'server_id' => $request->server_id,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
        ]);

        $order->load(['topupOption', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => $order
        ], 201);
    }

    // Menampilkan detail order berdasarkan ID
    public function show(Request $request, $id)
    {
        $order = $request->user()->orders()
            ->with(['topupOption', 'payment'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }
}