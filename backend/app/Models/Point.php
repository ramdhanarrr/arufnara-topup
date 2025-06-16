<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Point extends Model
{
    use HasFactory;

    protected $table = 'points';

    protected $fillable = [
        'user_id',
        'total_points',
        'last_updated',
    ];

    protected $dates = [
        'last_updated',
    ];

    public $timestamps = false;

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
