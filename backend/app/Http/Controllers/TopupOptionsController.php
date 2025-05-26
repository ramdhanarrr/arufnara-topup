<?php

namespace App\Http\Controllers;

use App\Models\TopupOption;
use Illuminate\Http\Request;

class TopupOptionsController extends Controller
{
    // GET /api/topup-options
    public function index()
    {
        return response()->json(TopupOption::all());
    }

    // POST /api/topup-options
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'points' => 'required|integer|min:0',
        ]);

        $topup = TopupOption::create($validated);
        return response()->json($topup, 201);
    }

    // GET /api/topup-options/{id}
    public function show($id)
    {
        $topup = TopupOption::find($id);
        if (!$topup) {
            return response()->json(['message' => 'Topup option not found'], 404);
        }

        return response()->json($topup);
    }

    // PUT /api/topup-options/{id}
    public function update(Request $request, $id)
    {
        $topup = TopupOption::find($id);
        if (!$topup) {
            return response()->json(['message' => 'Topup option not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'points' => 'sometimes|required|integer|min:0',
        ]);

        $topup->update($validated);
        return response()->json($topup);
    }

    // DELETE /api/topup-options/{id}
    public function destroy($id)
    {
        $topup = TopupOption::find($id);
        if (!$topup) {
            return response()->json(['message' => 'Topup option not found'], 404);
        }

        $topup->delete();
        return response()->json(['message' => 'Topup option deleted']);
    }
}