<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CareerSubmit extends Model
{
    /** @use HasFactory<\Database\Factories\CareerSubmitFactory> */
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

    public function position()
    {
        return $this->belongsTo(Position::class, 'position_code', 'code');
    }
    public function career()
    {
        return $this->belongsTo(Career::class, 'career_id', 'id');
    }
}
