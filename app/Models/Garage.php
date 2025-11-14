<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Garage extends Model
{
    /** @use HasFactory<\Database\Factories\GarageFactory> */
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
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id', 'id');
    }
    public function expert()
    {
        return $this->belongsTo(ItemBrand::class, 'brand_code', 'code');
    }
}
