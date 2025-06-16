<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TopupOptionsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\PointsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {

    // User management routes
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UsersController::class, 'profile']);
        Route::put('/profile', [UsersController::class, 'updateProfile']);
    });


    // Order management routes
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrdersController::class, 'index']);
        Route::post('/', [OrdersController::class, 'store']);
        Route::get('/{id}', [OrdersController::class, 'show']);
    });

    // User Payment Routes
    Route::prefix('payments')->group(function () {
        Route::post('/', [PaymentsController::class, 'createPayment']);
        Route::get('/order/{orderId}', [PaymentsController::class, 'getPaymentByOrder']);
        Route::get('/history', [PaymentsController::class, 'getPaymentHistory']);
    });

    //Point Management
    Route::prefix('points')->group(function () {
        Route::get('/', [PointsController::class, 'index']);
        Route::post('/use', [PointsController::class, 'usePoints']);
    });

    // Transaction routes (alias for orders with payments)
    Route::prefix('transactions')->group(function () {
        Route::get('/', [OrdersController::class, 'index']);
        Route::get('/{id}', [OrdersController::class, 'show']);
    });

    Route::get('/topup_options', [TopupOptionsController::class, 'index']);
    Route::get('/topup_options/{id}', [TopupOptionsController::class, 'show']);
});

// Admin routes (require admin role)
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {


    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Order management
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);

    // User management
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}/points', [AdminController::class, 'getUserPoints']);
    Route::post('/users', [AdminController::class, 'createUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    
    // Payment management
    Route::get('/payments', [AdminController::class, 'payments']);
    Route::patch('/payments/{id}/status', [AdminController::class, 'updateStatus']);

    // Topup options management
    Route::prefix('topup-options')->group(function () {
        Route::get('/', [AdminController::class, 'getTopupOptions']);
        Route::post('/', [AdminController::class, 'createTopupOption']);
        Route::put('/{id}', [AdminController::class, 'updateTopupOption']);
        Route::get('/{id}', [AdminController::class, 'showTopupOption']);
        Route::delete('/{id}', [AdminController::class, 'deleteTopupOption']);
    });
});

// Route Topup Option
// Route::get('/topup_options', [TopupOptionsController::class, 'index']);
// Route::get('/topup_options/{id}', [TopupOptionsController::class, 'show']);



Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
