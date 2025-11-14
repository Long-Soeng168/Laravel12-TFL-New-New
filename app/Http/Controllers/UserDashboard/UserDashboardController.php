<?php

namespace App\Http\Controllers\UserDashboard;

use App\Http\Controllers\Controller;
use App\Models\GaragePost;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $item_counts = Item::where('shop_id', $request->user()->shop_id)->count();
        $garage_post_counts = GaragePost::where('garage_id', $request->user()->garage_id)->count();
        return Inertia::render("user-dashboard/Dashboard", [
            'item_counts' => $item_counts,
            'garage_post_counts' => $garage_post_counts,
        ]);
    }
}
