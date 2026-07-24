<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportConversation extends Model
{
    protected $fillable = ['user_id', 'subject', 'status'];

    public function user() { return $this->belongsTo(User::class); }
    public function messages() { return $this->hasMany(SupportMessage::class); }
}
