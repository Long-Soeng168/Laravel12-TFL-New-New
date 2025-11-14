<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    /** @use HasFactory<\Database\Factories\BannerFactory> */
    use HasFactory;

    protected $guarded = [];

    public function position()
    {
        return $this->belongsTo(BannerPosition::class, 'position_code', 'code');
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
        return $this->hasMany(BannerImage::class, 'banner_id', 'id');
    }
}
