<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    /** @use HasFactory<\Database\Factories\ShopFactory> */
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
    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_code', 'code');
    }
}
