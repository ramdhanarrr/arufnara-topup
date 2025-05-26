<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TopupOptionSeeder extends Seeder
{
    public function run()
    {
        DB::table('topup_options')->insert([
            [
                'id' => 1,
                'diamond_amount' => 86,
                'bonus_diamond' => 0,
                'price' => 15000.00,
            ],
            [
                'id' => 2,
                'diamond_amount' => 172,
                'bonus_diamond' => 0,
                'price' => 30000.00,
            ],
            [
                'id' => 3,
                'diamond_amount' => 257,
                'bonus_diamond' => 0,
                'price' => 45000.00,
            ],
            [
                'id' => 4,
                'diamond_amount' => 344,
                'bonus_diamond' => 0,
                'price' => 60000.00,
            ],
            [
                'id' => 5,
                'diamond_amount' => 429,
                'bonus_diamond' => 0,
                'price' => 75000.00,
            ],
            [
                'id' => 6,
                'diamond_amount' => 514,
                'bonus_diamond' => 0,
                'price' => 90000.00,
            ],
            [
                'id' => 7,
                'diamond_amount' => 600,
                'bonus_diamond' => 81,
                'price' => 105000.00,
            ],
            [
                'id' => 8,
                'diamond_amount' => 706,
                'bonus_diamond' => 81,
                'price' => 120000.00,
            ],
            [
                'id' => 9,
                'diamond_amount' => 878,
                'bonus_diamond' => 122,
                'price' => 150000.00,
            ],
            [
                'id' => 10,
                'diamond_amount' => 1412,
                'bonus_diamond' => 224,
                'price' => 240000.00,
            ]
        ]);
    }
}
