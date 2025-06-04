<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Order;
use App\Models\Point;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PaymentsController extends Controller
{
    /**
     * Create a new payment for an order
     */
    public function createPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if order belongs to authenticated user
            $order = Order::where('id', $request->order_id)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found or access denied'
                ], 404);
            }

            // Check if order already has a payment
            $existingPayment = Payment::where('order_id', $request->order_id)->first();
            if ($existingPayment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment already exists for this order',
                    'existing_payment' => [
                        'payment_id' => $existingPayment->id,
                        'status' => $existingPayment->payment_status
                    ]
                ], 400);
            }

            // Check if order is already paid
            if ($order->status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Order is already paid. Cannot create new payment.',
                    'order_status' => $order->status
                ], 400);
            }

            // Verify amount matches order amount
            $topupOption = $order->topupOption;
            if ($request->amount != $topupOption->price) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment amount does not match order amount'
                ], 400);
            }

            // Create payment - only include columns that exist in your table
            $payment = new Payment();
            $payment->order_id = $request->order_id;
            $payment->amount = $request->amount;
            $payment->payment_status = 'pending';
            $payment->transaction_date = now();
            $payment->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment created successfully',
                'data' => [
                    'payment_id' => $payment->id,
                    'order_id' => $payment->order_id,
                    'amount' => $payment->amount,
                    'payment_status' => $payment->payment_status,
                    'transaction_date' => $payment->transaction_date
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment by order ID
     */
    public function getPaymentByOrder($orderId)
    {
        try {
            // Check if order belongs to authenticated user
            $order = Order::where('id', $orderId)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found or access denied'
                ], 404);
            }

            $payment = Payment::where('order_id', $orderId)
                              ->with('order.topupOption')
                              ->first();

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found for this order'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'payment_id' => $payment->id,
                    'order_id' => $payment->order_id,
                    'amount' => $payment->amount,
                    'payment_status' => $payment->payment_status,
                    'transaction_date' => $payment->transaction_date,
                    'order_details' => [
                        'ml_user_id' => $payment->order->ml_user_id,
                        'server_id' => $payment->order->server_id,
                        'diamond_amount' => $payment->order->topupOption->diamond_amount,
                        'bonus_diamond' => $payment->order->topupOption->bonus_diamond
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's payment history
     */
    public function getPaymentHistory()
    {
        try {
            $payments = Payment::with(['order.topupOption'])
                              ->whereHas('order', function($query) {
                                  $query->where('user_id', Auth::id());
                              })
                              ->orderBy('transaction_date', 'desc')
                              ->get();

            $paymentHistory = $payments->map(function($payment) {
                return [
                    'payment_id' => $payment->id,
                    'order_id' => $payment->order_id,
                    'amount' => $payment->amount,
                    'payment_status' => $payment->payment_status,
                    'transaction_date' => $payment->transaction_date,
                    'ml_user_id' => $payment->order->ml_user_id,
                    'server_id' => $payment->order->server_id,
                    'diamond_amount' => $payment->order->topupOption->diamond_amount,
                    'bonus_diamond' => $payment->order->topupOption->bonus_diamond,
                    'order_status' => $payment->order->status
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $paymentHistory
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}