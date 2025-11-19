<?php

namespace App\Http\Controllers;

use App\Helpers\TelegramHelper;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class OrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:order view', only: ['index', 'show']),
            new Middleware('permission:order delete', only: ['destroy']),
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

        $tableData = $query->withCount('order_items')->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/orders/Index', [
            'tableData' => $tableData,
        ]);
    }
    public function show(Order $order)
    {
        return Inertia::render('admin/orders/Show', [
            'order_detail' => $order->load('order_items.item.images', 'buyer', 'shop'),
            'readOnly' => true,
        ]);
    }
    public function destroy(Order $order)
    {
        if ($order->status == 'pending') {
            $order->delete();
            return redirect()->back()->with('success', 'Order deleted successfully.');
        }
        return redirect()->back()->with('error', 'Order cannot deleted, Please Contact Developer.');
    }

    public function updateStatus(Request $request, $id)
    {
        // return $request->all();
        $request->validate([
            'status' => 'required|in:pending,paid,shipped,completed,cancelled,refunded',
        ]);

        $order = Order::findOrFail($id);

        try {
            $order->status = $request->status;
            $order->save();

            return back()->with('success', "Order status updated to {$order->status}");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update order status: ' . $e->getMessage());
        }
    }


    public function store(Request $request)
    {
        // return response()->json([
        //     'received' => $request->all(),
        //     'message' => 'Order received successfully',
        // ]);
        // Validate request
        // dd($request->all());
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'note'       => 'nullable|string',
            'total_amount'      => 'nullable|numeric',
            'payment_method'       => 'nullable|string',
            'tran_id'       => 'nullable|string',
            'req_time'       => 'nullable|string',
            'currency'       => 'nullable|string',
            'shipping_price' => 'nullable|numeric',
            'shipping_lat' => 'nullable|numeric',
            'shipping_lng' => 'nullable|numeric',
            'items'      => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.item_name' => 'nullable|string',
            'items.*.price'   => 'required|numeric',
            'items.*.discount_percent' => 'nullable|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sub_total'    => 'required|numeric',
        ]);

        try {
            DB::beginTransaction();

            // Create Order Number Sequent base on each shop
            $shopId = $validated['shop_id'];

            $lastOrder = Order::where('shop_id', $shopId)
                ->orderBy('id', 'desc')
                ->first();


            $nextNumber = 1;
            if ($lastOrder && $lastOrder->order_number) {
                $parts = explode('-', $lastOrder->order_number);
                $nextNumber = isset($parts[2]) ? intval($parts[2]) + 1 : 1;
            }

            $order_number = sprintf('%s-%d-%06d', date('Ymd'), $shopId, $nextNumber);
            // dd($order_number);

            // Create Order Number Sequent base on each shop

            // Create order
            $order = Order::create([
                'order_number' => $order_number,
                'shop_id' => $validated['shop_id'],
                'user_id' => $request->user()->id ?? null,

                'shipping_price' => $validated['shipping_price'] ?? null,
                'shipping_address' => $request->user()?->address ?? 'N/A',
                'shipping_lat' => $validated['shipping_lat'] ?? null,
                'shipping_lng' => $validated['shipping_lng'] ?? null,
                'notes' => $validated['note'] ?? null,

                'total_amount' => $validated['total_amount'] ?? 0,
                'currency' => $validated['currency'] ?? 0,
                'tran_id' => $validated['tran_id'] ?? null,
                'req_time' => $validated['req_time'] ?? null,
                'payment_method' => $validated['payment_method'] ?? null,
                'payment_status' => 'PENDING',
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id'      => $order->id,
                    'shop_id'       => $shopId,
                    'item_id'       => $item['item_id'],
                    'item_name'       => $item['item_name'],
                    'price'         => $item['price'],
                    'discount_percent' => $item['discount_percent'] ?? 0.00,
                    'quantity'      => $item['quantity'],
                    'sub_total'      => $item['sub_total'],
                ]);
            }

            DB::commit();

            // return redirect("/user-orders/{$order->id}");

            return back()->with([
                'success' => 'Order placed successfully!',
                'order_id' => $order->id
            ]);

            // $result = TelegramHelper::sendOrderItems($order->load('shop'));
            // if ($result['success']) {
            //     return back()->with('success', 'Order placed successfully!');
            // } else {
            //     return back()->with('error', 'Order fail to push notification.');
            // }

            // Payment Process
            // if ($result['success']) {
            //     return response()->json([
            //         'success' => true,
            //         'message' => 'Order placed successfully!'
            //     ]);
            // } else {
            //     return response()->json([
            //         'success' => false,
            //         'message' => $result['message']
            //     ], 500);
            // }
        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'general' => 'Failed to place order. ' . $e->getMessage()
            ]);
        }
    }
}
