<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PointSeeder extends Seeder
{
    public function run()
    {
        DB::table('points')->insert([
            [
                'id' => 1,
                'user_id' => 1,
                'total_points' => 1000,
                'last_updated' => now(),
            ],
            [
                'id' => 2,
                'user_id' => 2,
                'total_points' => 500,
                'last_updated' => now(),
            ],
            [
                'id' => 3,
                'user_id' => 3,
                'total_points' => 250,
                'last_updated' => now(),
            ],
            [
                'id' => 4,
                'user_id' => 4,
                'total_points' => 0,
                'last_updated' => now(),
            ]
        ]);
    }
}
