<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    protected $guarded = [];
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }
    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_code', 'code');
    }
    public function brand()
    {
        return $this->belongsTo(ItemBrand::class, 'brand_code', 'code');
    }
    public function model()
    {
        return $this->belongsTo(ItemModel::class, 'model_code', 'code');
    }
    public function brand_model()
    {
        return $this->belongsTo(ItemModel::class, 'model_code', 'code');
    }
    public function body_type()
    {
        return $this->belongsTo(ItemBodyType::class, 'body_type_code', 'code');
    }
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
        return $this->hasMany(ItemImage::class, 'item_id', 'id');
    }
    // In Item.php model
    public function colors()
    {
        return $this->hasMany(ItemWithColors::class, 'item_id', 'id');
    }

    // In Item.php
    public function colors_with_details()
    {
        return $this->hasManyThrough(
            ItemColor::class,       // Final model
            ItemWithColors::class,  // Intermediate model
            'item_id',              // Foreign key on intermediate table (ItemWithColors)
            'code',                   // Foreign key on final table (ItemColor)
            'id',                   // Local key on this table (Item)
            'color_code'              // Local key on intermediate table pointing to final table
        );
    }
    public function sizes()
    {
        return $this->hasMany(ItemWithSizes::class, 'item_id', 'id');
    }

    // In Item.php
    public function sizes_with_details()
    {
        return $this->hasManyThrough(
            ItemSize::class,       // Final model
            ItemWithSizes::class,  // Intermediate model
            'item_id',              // Foreign key on intermediate table (ItemWithColors)
            'code',                   // Foreign key on final table (ItemColor)
            'id',                   // Local key on this table (Item)
            'size_code'              // Local key on intermediate table pointing to final table
        );
    }
}
