<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TopupOption extends Model
{
    protected $fillable = [
        'id',
        'diamond_amount',
        'bonus_diamond',
        'price',
    ];
}
