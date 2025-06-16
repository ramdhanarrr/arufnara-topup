<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
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

     public function show($id)
    {
        try {
            // Gunakan model yang sesuai dengan aplikasi Anda
            $payment = Payment::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $payment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found: ' . $e->getMessage()
            ], 404);
        }
    }

    public function updateStatus(Request $request, $id): JsonResponse
{
    try {
        // Validasi input - hanya allow success dan failed
        $validatedData = $request->validate([
            'payment_status' => 'required|string|in:success,failed',
        ]);

        // Cari payment berdasarkan ID
        $payment = Payment::findOrFail($id);

        // Update payment status
        $payment->update([
            'payment_status' => $validatedData['payment_status'],
            'updated_at' => now()
        ]);

        // Load relationships untuk response
        $payment->load(['order.user']);

        // Log untuk debugging
        \Log::info('Payment status updated successfully', [
            'payment_id' => $id,
            'old_status' => $payment->getOriginal('payment_status'),
            'new_status' => $validatedData['payment_status'],
            'updated_by' => $request->user()->id ?? 'unknown'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment status updated successfully',
            'data' => $payment
        ]);

    } catch (ValidationException $e) {
        \Log::error('Validation error in updateStatus', [
            'payment_id' => $id,
            'errors' => $e->errors(),
            'input' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        \Log::error('Payment not found', [
            'payment_id' => $id,
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Payment not found'
        ], 404);

    } catch (\Exception $e) {
        \Log::error('Error updating payment status', [
            'payment_id' => $id,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'input' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to update payment status: ' . $e->getMessage()
        ], 500);
    }
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

    public function showTopupOption($id)
{
    $topup = TopupOption::find($id);

    if (!$topup) {
        return response()->json(['message' => 'Topup option not found'], 404);
    }

    return response()->json(['data' => $topup], 200);
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
    // POST: /admin/users
    public function createUser(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'username' => 'required|string|max:255|unique:users,username',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        'role' => 'required|string',
    ]);

    $user = User::create([
        'name' => $request->name,
        'username' => $request->username,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
    ]);

    return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
}

    // PUT: /admin/users/{id}
   public function updateUser(Request $request, $id)
{
    try {
        // Gunakan DB transaction untuk memastikan atomicity
        return DB::transaction(function () use ($request, $id) {
            $user = User::with('points')->findOrFail($id);

            // Debug: Log input data
            \Log::info('Update User Request Data:', $request->all());

            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'username' => [
                    'sometimes', 'required', 'string', 'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'email' => [
                    'sometimes', 'required', 'string', 'email', 'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'points' => 'sometimes|nullable|integer|min:0',
            ]);

            // Update data user
            $userData = $request->only(['name', 'username', 'email']);
            
            // Hanya update jika ada data yang berubah
            if (!empty($userData)) {
                // Debug: Log data yang akan diupdate
                \Log::info('User data to update:', $userData);
                
                // Gunakan fill dan save untuk memastikan update
                $user->fill($userData);
                $saved = $user->save();
                
                \Log::info('User update result:', ['saved' => $saved, 'user_id' => $user->id]);
            }

            // Handle update points
            if ($request->has('points') && $request->points !== null) {
                $pointsValue = (int) $request->input('points');
                
                // Debug: Log points update
                \Log::info('Updating points:', ['user_id' => $user->id, 'points' => $pointsValue]);
                
                // Cek apakah sudah ada record points
                $existingPoints = $user->points()->first();
                
                if ($existingPoints) {
                    // Update existing record
                    $existingPoints->update(['total_points' => $pointsValue]);
                    \Log::info('Points updated:', $existingPoints->fresh()->toArray());
                } else {
                    // Create new record
                    $newPoints = $user->points()->create(['total_points' => $pointsValue]);
                    \Log::info('Points created:', $newPoints->toArray());
                }
            }

            // Refresh data dengan relationship yang terbaru
            $updatedUser = User::with('points')->find($user->id);

            return response()->json([
                'success' => true,
                'message' => 'User berhasil diupdate',
                'data' => $updatedUser
            ]);
        });

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation Error',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Error updating user:', [
            'user_id' => $id,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengupdate user: ' . $e->getMessage()
        ], 500);
    }
}



    // DELETE: /admin/users/{id}
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}