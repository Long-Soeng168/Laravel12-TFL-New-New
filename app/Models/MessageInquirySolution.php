<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageInquirySolution extends Model
{
    protected $guarded = [];

    public function message_inquiry()
    {
        return $this->belongsTo(MessageInquiry::class, 'message_id', 'id');
    }

    public function solution()
    {
        return $this->belongsTo(Page::class, 'solution_id', 'id');
    }
}
