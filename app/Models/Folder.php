<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    /** @use HasFactory<\Database\Factories\FolderFactory> */
    use HasFactory;
    protected $guarded = [];
    protected $appends = ['path'];
    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id', 'id')->with('children');
    }
    public function files()
    {
        return $this->hasMany(File::class, 'folder_id', 'id');
    }
    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }

    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id', 'id');
    }

    // Accessor to return the path as an array of ancestor folders
    public function getPathAttribute()
    {
        $path = [];
        $current = $this->parent;

        while ($current) {
            $path[] = [
                'id' => $current->id,
                'name' => $current->name,
                'parent_id' => $current->parent_id,
                'path' => $current->path,
            ];
            $current = $current->parent;
        }

        return array_reverse($path);
    }
}
