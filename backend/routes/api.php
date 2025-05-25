<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TopupOptionsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\PaymentsController;
use App\Http\Controllers\PointsController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route Users
Route::get('/users', [UsersController::class, 'index']);

// Route Points
Route::get('/points', [PointsController::class, 'index']);
Route::post('/points', [PointsController::class, 'store']);

// Route Orders
Route::get('/orders', [OrdersController::class, 'index']);
Route::post('/orders', [OrdersController::class, 'store']);
Route::delete('/orders/{id}', [OrdersController::class, 'destroy']);

// Route Payment
Route::get('/payments', [PaymentsController::class, 'index']);

// Route Topup Option
Route::get('/topup_options', [TopupOptionsController::class, 'index']);

// Route Admin Order
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/orders', [AdminOrderController::class, 'index']);
    Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
    Route::post('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);
});

// Route Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

