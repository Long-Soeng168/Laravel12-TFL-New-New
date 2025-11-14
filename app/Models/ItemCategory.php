<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemCategory extends Model
{
    /** @use HasFactory<\Database\Factories\ItemCategoryFactory> */
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

    public function items()
    {
        return $this->hasMany(Item::class, 'category_code', 'code');
    }
    public function children()
    {
        return $this->hasMany(ItemCategory::class, 'parent_code', 'code');
    }
    public function parent()
    {
        return $this->belongsTo(ItemCategory::class, 'parent_code', 'code');
    }

    public function children_items()
    {
        return $this->hasManyThrough(Item::class, ItemCategory::class, 'parent_code', 'category_code', 'code', 'code');
    }

    // In Category.php
    public function brands()
    {
        return $this->belongsToMany(ItemBrand::class, 'brand_category', 'category_code', 'brand_code', 'code', 'code');
    }
    public function getAllBrandsAttribute()
    {
        $allBrands = $this->brands ?? collect();
        $parent = $this->parent;

        // Recursively collect brands from all ancestors
        while ($parent) {
            $allBrands = $allBrands->merge($parent->brands ?? collect());
            $parent = $parent->parent;
        }

        // Clean up relations to free memory if needed
        unset($this->relations['brands']);
        if ($this->relationLoaded('parent')) {
            $p = $this->parent;
            while ($p) {
                unset($p->relations['brands']);
                $p = $p->parent;
            }
        }

        return $allBrands->unique('code')->sortBy('name')->values();
    }



    public function getAllCategoryCodes(): array
    {
        $codes = [$this->code];

        foreach ($this->children as $child) {
            $codes = array_merge($codes, $child->getAllCategoryCodes());
        }

        return $codes;
    }
}
