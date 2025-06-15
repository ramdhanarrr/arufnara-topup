<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register
    public function register(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:100',
        'username' => 'required|string|max:50|unique:users',
        'email' => 'required|email|max:100|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $validated['password'] = bcrypt($validated['password']);
    $validated['role'] = 'user'; // default role

    $user = User::create($validated);

    return response()->json([
        'success' => true,
        'data' => $user
    ], 201);
}

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.']
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // Logout
    public function logout(Request $request)
{
    if ($request->user()) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    return response()->json(['message' => 'User not authenticated'], 401);
}

}
