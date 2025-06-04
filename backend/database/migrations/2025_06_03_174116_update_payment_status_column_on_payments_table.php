<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePaymentStatusColumnOnPaymentsTable extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // ubah kolom payment_status menjadi enum
            $table->enum('payment_status', ['pending', 'success', 'failed'])->change();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // rollback ke tipe sebelumnya, sesuaikan jika awalnya varchar atau enum lain
            $table->string('payment_status')->change();
        });
    }
}
