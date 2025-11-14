<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannerPosition extends Model
{
    /** @use HasFactory<\Database\Factories\BannerPositionFactory> */
    use HasFactory;

    protected $guarded = [];
    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
