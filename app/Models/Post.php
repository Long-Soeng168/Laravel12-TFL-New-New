<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(PostCategory::class, 'category_code', 'code');
    }
    public function source_detail()
    {
        return $this->belongsTo(Link::class, 'source', 'id');
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
        return $this->hasMany(PostImage::class, 'post_id', 'id');
    }
    // public function videos()
    // {
    //     return $this->hasMany(PostVideoLink::class, 'post_id', 'id');
    // }
    // public function files()
    // {
    //     return $this->hasMany(PostFile::class, 'post_id', 'id');
    // }
}
