<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostCategory extends Model
{
    /** @use HasFactory<\Database\Factories\PostCategoryFactory> */
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

    public function posts()
    {
        return $this->hasMany(Post::class, 'category_code', 'code');
    }
    public function children()
    {
        return $this->hasMany(PostCategory::class, 'parent_code', 'code');
    }
    public function parent()
    {
        return $this->belongsTo(PostCategory::class, 'parent_code', 'code');
    }
}
