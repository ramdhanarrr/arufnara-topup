<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'topup_option_id',
        'ml_user_id',
        'server_id',
        'payment_method',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function topupOption()
    {
        return $this->belongsTo(TopupOption::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isPaid()
    {
        return $this->status === 'paid';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }

    public function getTotalAmount()
    {
        return $this->topupOption->price;
    }
}
