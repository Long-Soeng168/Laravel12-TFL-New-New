<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;


class FileExploreController extends Controller
{
    public function folder($path)
    {
        $path = str_replace('~', '/', $path);
        $files = Storage::disk('real_storage')->files($path);
        $folders = Storage::disk('real_storage')->directories($path);

        return response()->json([
            'files' => $files,
            'folders' => $folders,
            'path' => $path
        ]);
    }
}
