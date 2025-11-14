<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemBrand extends Model
{
    /** @use HasFactory<\Database\Factories\ItemBrandFactory> */
    use HasFactory;
    protected $guarded = [];

    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function items()
    {
        return $this->hasMany(Item::class, 'brand_code', 'code');
    }

    // In Brand.php
    public function categories()
    {
        return $this->belongsToMany(ItemCategory::class, 'brand_category', 'brand_code', 'category_code', 'code', 'code');
    }

    
}
