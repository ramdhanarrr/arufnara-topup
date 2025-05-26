<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        DB::table('payments')->insert([
            [
                'id' => 1,
                'order_id' => 1,
                'amount' => 15000.00,
                'payment_status' => 'success',
                'transaction_date' => now(),
            ],
            [
                'id' => 2,
                'order_id' => 2,
                'amount' => 45000.00,
                'payment_status' => 'failed',
                'transaction_date' => now(),
            ],
            [
                'id' => 3,
                'order_id' => 3,
                'amount' => 30000.00,
                'payment_status' => 'failed',
                'transaction_date' => now(),
            ],
            [
                'id' => 4,
                'order_id' => 4,
                'amount' => 75000.00,
                'payment_status' => 'success',
                'transaction_date' => now(),
            ]
        ]);
    }
}
