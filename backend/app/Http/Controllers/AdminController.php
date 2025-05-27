<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use App\Models\TopupOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            return $next($request);
        });
    }

    public function dashboard()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_orders' => Order::count(),
            'total_revenue' => Payment::where('payment_status', 'success')->sum('amount'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'recent_orders' => Order::with(['user', 'topupOption'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function orders()
    {
        $orders = Order::with(['user', 'topupOption', 'payment'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,failed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => $order
        ]);
    }

    public function users()
    {
        $users = User::with('points')->where('role', 'user')->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function payments()
    {
        $payments = Payment::with('order.user')->get();

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    public function getUserPoints($userId)
    {
        $user = User::with('points')->findOrFail($userId);

        return response()->json([
            'success' => true,
            'data' => $user->points
        ]);
    }

    // Topup Options Management
    public function createTopupOption(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'diamond_amount' => 'required|integer|min:1',
            'bonus_diamond' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $topupOption = TopupOption::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Topup option created successfully',
            'data' => $topupOption
        ], 201);
    }

    public function updateTopupOption(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'diamond_amount' => 'integer|min:1',
            'bonus_diamond' => 'integer|min:0',
            'price' => 'numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $topupOption = TopupOption::findOrFail($id);
        $topupOption->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Topup option updated successfully',
            'data' => $topupOption
        ]);
    }

    public function deleteTopupOption($id)
    {
        $topupOption = TopupOption::findOrFail($id);
        $topupOption->delete();

        return response()->json([
            'success' => true,
            'message' => 'Topup option deleted successfully'
        ]);
    }
}