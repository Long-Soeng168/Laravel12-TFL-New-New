<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $type = $request->input('type');
        $position_code = $request->input('position_code');

        $query = Page::query();

        $query->with('images');

        if ($position_code) {
            $query->where('position_code', $position_code);
        }
        if ($type) {
            $query->where('type', $type);
        }
        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->where('status', 'active')->first();

        return response()->json($tableData);
    }
}

