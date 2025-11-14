<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemSize extends Model
{
    protected $guarded = [];

    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    // public function items()
    // {
    //     return $this->hasMany(Item::class, 'brand_code', 'code');
    // }

    // In Brand.php
    public function categories()
    {
        return $this->belongsToMany(ItemCategory::class, 'item_size_categories', 'size_code', 'category_code', 'code', 'code');
    }
}
