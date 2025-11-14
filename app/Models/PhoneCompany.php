<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhoneCompany extends Model
{
    /** @use HasFactory<\Database\Factories\PhoneCompanyFactory> */
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
}
