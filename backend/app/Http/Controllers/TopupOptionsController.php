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

    public function show($id)
    {
        $topupOption = TopupOption::findOrFail($id);
        $topupOption->total_diamonds = $topupOption->getTotalDiamonds();
        $topupOption->points_reward = $topupOption->getPointsReward();

        return response()->json([
            'success' => true,
            'data' => $topupOption
        ]);
    }
}