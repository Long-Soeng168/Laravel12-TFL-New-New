<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GaragePost extends Model
{
    /** @use HasFactory<\Database\Factories\GaragePostFactory> */
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
    public function images()
    {
        return $this->hasMany(GaragePostImage::class, 'post_id', 'id');
    }

    public function garage()
    {
        return $this->belongsTo(Garage::class, 'garage_id', 'id');
    }
}
