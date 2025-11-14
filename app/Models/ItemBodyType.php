<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemBodyType extends Model
{
    /** @use HasFactory<\Database\Factories\ItemBodyTypeFactory> */
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
        return $this->hasMany(Item::class, 'body_type_code', 'code');
    }
}
