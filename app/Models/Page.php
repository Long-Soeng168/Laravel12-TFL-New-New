<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    /** @use HasFactory<\Database\Factories\PageFactory> */
    use HasFactory;
    protected $guarded = [];

    public function position()
    {
        return $this->belongsTo(PagePosition::class, 'position_code', 'code');
    }
    public function source_detail()
    {
        return $this->belongsTo(Link::class, 'source', 'id');
    }
    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id', 'id');
    }
    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id', 'id');
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
        return $this->hasMany(PageImage::class, 'page_id', 'id');
    }
}
