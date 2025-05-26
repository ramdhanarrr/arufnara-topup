<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run()
    {
        DB::table('orders')->insert([
            [
                'id' => 1,
                'user_id' => 2,
                'topup_option_id' => 1,
                'ml_user_id' => '123456789',
                'server_id' => '1001',
                'payment_method' => 'dana',
                'status' => 'paid',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'user_id' => 3,
                'topup_option_id' => 3,
                'ml_user_id' => '987654321',
                'server_id' => '1002',
                'payment_method' => 'gopay',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'user_id' => 4,
                'topup_option_id' => 2,
                'ml_user_id' => '555666777',
                'server_id' => '1003',
                'payment_method' => 'ovo',
                'status' => 'failed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'user_id' => 2,
                'topup_option_id' => 5,
                'ml_user_id' => '111222333',
                'server_id' => '1001',
                'payment_method' => 'shopeepay',
                'status' => 'paid',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
