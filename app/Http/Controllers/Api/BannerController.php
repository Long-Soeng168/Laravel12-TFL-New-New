<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'order_index');
        $sortDirection = $request->input('sortDirection', 'asc');
        $status = $request->input('status');
        $type = $request->input('type');
        $position_code = $request->input('position_code');

        $query = Banner::query();

        $query->with( 'images');

        if ($type) {
            $query->where('type', $type);
        }
        if ($position_code) {
            $query->where('position_code', $position_code);
        }
        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->where('status', 'active')->get();

        return response()->json($tableData);
    }
}
