<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    /** @use HasFactory<\Database\Factories\FileFactory> */
    use HasFactory;

    protected $guarded = [];
    public function parent()
    {
        return $this->belongsTo(Folder::class, 'folder_id', 'id');
    }
    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
