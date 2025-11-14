<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageInquiry extends Model
{
    protected $guarded = [];
    public function inquiry_solutions()
    {
        return $this->hasMany(MessageInquirySolution::class, 'message_id', 'id');
    }
}
