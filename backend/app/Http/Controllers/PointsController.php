<?php

namespace App\Http\Controllers;

use App\Models\Point;
use Illuminate\Http\Request;

class PointsController extends Controller
{
    // GET /points
    public function index()
    {
        $points = Point::with('user')->get();
        return response()->json($points);
    }

    // POST /points
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_points' => 'required|integer'
        ]);

        $point = Point::create($validated);
        return response()->json($point, 201);
    }

    // GET /points/{id}
    public function show($id)
    {
        $point = Point::with('user')->find($id);
        if (!$point) {
            return response()->json(['message' => 'Points not found'], 404);
        }
        return response()->json($point);
    }

    // PUT /points/{id}
    public function update(Request $request, $id)
    {
        $point = Point::find($id);
        if (!$point) {
            return response()->json(['message' => 'Points not found'], 404);
        }

        $validated = $request->validate([
            'total_points' => 'sometimes|required|integer'
        ]);

        $point->update($validated);
        return response()->json($point);
    }

    // DELETE /points/{id}
    public function destroy($id)
    {
        $point = Point::find($id);
        if (!$point) {
            return response()->json(['message' => 'Points not found'], 404);
        }

        $point->delete();
        return response()->json(['message' => 'Points deleted']);
    }
}