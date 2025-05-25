<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{   
    protected $fillable = [
        'id',
        'user_id',
        'topup_option_id',
        'ml_user_id',
        'server_id',
        'payment_method',
        'status',
    ];

        public function user() {
        return $this->belongsTo(User::class);
    }

        public function topupOption() {
        return $this->belongsTo(TopupOption::class);
    }

        public function payment() {
        return $this->hasOne(Payment::class);
    }
}
