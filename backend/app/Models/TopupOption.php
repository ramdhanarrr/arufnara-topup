<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopupOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'diamond_amount',
        'bonus_diamond',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Helper methods
    public function getTotalDiamonds()
    {
        return $this->diamond_amount + $this->bonus_diamond;
    }

    public function getPointsReward()
    {
        // 1% dari harga sebagai poin reward
        return floor($this->price * 0.01);
    }
}
