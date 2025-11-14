<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Link;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'order_index');
        $status = $request->input('status', '');
        $type = $request->input('type', '');
        $sortDirection = $request->input('sortDirection', 'asc');

        $query = Link::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('title', 'LIKE', "%{$search}%");
            });
        }
        if ($type) {
            $query->where("type", $type);
        }
        if ($status) {
            $query->where("status", $status);
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->where('status', 'active')->get();

        return response()->json($tableData);
    }
}
