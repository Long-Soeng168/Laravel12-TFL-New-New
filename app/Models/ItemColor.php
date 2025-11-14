<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemColor extends Model
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
        return $this->belongsToMany(ItemCategory::class, 'item_color_categories', 'color_code', 'category_code', 'code', 'code');
    }
}
