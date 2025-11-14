<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;

class ShopOrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // new Middleware('role:Shop', only: ['index', 'show']),
            // new Middleware('role:Shop', only: ['create', 'store']),
            // new Middleware('role:Shop', only: ['edit', 'update', 'update_status']),
            // new Middleware('role:Shop', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Order::query();

        $query->with('buyer', 'shop');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('order_number', 'LIKE', "%{$search}%");
            });
        }

        $query->where('shop_id', $request->user()->shop_id);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        // return $tableData;
        return Inertia::render('user-dashboard/shop_orders/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        dd('Create Function');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        dd('Store Function');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $shop_order)
    {
        if ($shop_order->shop_id != Auth::user()->shop_id) {
            abort(403, 'Unauthorized resource');
        }

        return Inertia::render('user-dashboard/shop_orders/Show', [
            'order_detail' => $shop_order->load('order_items.item.images', 'buyer'),
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Item $shop_order)
    {
        if ($shop_order->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        $editData = $shop_order->load('order_items.item.images');
        dd($editData);
        return Inertia::render('user-dashboard/shop_orders/Create', [
            'editData' => $editData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $shop_order)
    {
        if ($shop_order->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        dd($request->all());
    }

    public function update_status(Request $request, Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $user_item->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $shop_order)
    {
        if ($shop_order->shop_id != Auth::user()->shop_id) {
            abort(404); // order not found / not yours
        }

        if ($shop_order->status != 'pending') {
            abort(403, 'Cannot delete: status is not pending');
        }

        $shop_order->delete();
        return redirect()->back()->with('success', 'Order deleted successfully.');
    }
}
