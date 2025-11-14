<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Image;

class SlideController extends Controller
{
    public function index(Request $request)
    {
        $position = $request->position;

        if ($position) {
            $slides = Banner::where('position_code', $position)->get();
        } else {
            $slides = Banner::all();
        }

        $data = $slides->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->title,
                'image' => $item->image,
                'position' => $item->position_code,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        return response()->json($data);
    }
}
