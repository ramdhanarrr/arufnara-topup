<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Point;
use Illuminate\Support\Facades\Auth;
use App\Models\PointsHistory;

class PointsController extends Controller
{
    // Ambil total poin user yang sedang login
    public function index()
    {
        $user = Auth::user();

        $point = Point::where('user_id', $user->id)->first();

        if (!$point) {
            return response()->json(['total_points' => 0]);
        }

        return response()->json(['total_points' => $point->total_points]);
    }

    // Gunakan poin untuk diskon/transaksi
    public function usePoints(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:1'
        ]);

        $user = Auth::user();
        $point = Point::where('user_id', $user->id)->first();

        if (!$point || $point->total_points < $request->amount) {
            return response()->json(['message' => 'Not enough points.'], 400);
        }

        $point->total_points -= $request->amount;
        $point->last_updated = now();
        $point->save();

        return response()->json(['message' => 'Points used successfully', 'remaining_points' => $point->total_points]);
    }

   public function history()
{
    $user = Auth::user();

    $histories = \App\Models\Point::where('user_id', $user->id)
        // ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'point_history' => $histories
    ]);
}




}
