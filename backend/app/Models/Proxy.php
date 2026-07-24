<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Proxy extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'ip_address',
        'port',
        'username',
        'password',
        'protocol',
        'status',
        'latency',
        'last_tested_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
