<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GaragePostDailyView extends Model
{
    /** @use HasFactory<\Database\Factories\GaragePostDailyViewFactory> */
    use HasFactory;
    protected $guarded = [];

    public function post(){
        return $this->belongsTo(GaragePost::class, 'post_id', 'id');
    }
}
