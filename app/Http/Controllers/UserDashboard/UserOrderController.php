<?php

namespace App\Http\Controllers\UserDashboard;

use App\Exports\ItemDailyViewExport;
use App\Helpers\ImageHelper;
use App\Helpers\TelegramHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Merchants;
use App\Models\Item;
use App\Models\ItemBrand;
use App\Models\ItemCategory;
use App\Models\ItemDailyView;
use App\Models\ItemImage;
use App\Models\Order;
use App\Models\Shop;
use App\Services\PayWayService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class UserOrderController extends Controller implements HasMiddleware
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

    protected $payWayService;

    public function __construct(PayWayService $payWayService)
    {
        $this->payWayService = $payWayService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Order::query();

        $query->with('shop');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('order_number', 'LIKE', "%{$search}%")->orWhere('id', $search)->orWhere('tran_id', $search);
            });
        }

        $query->where('user_id', $request->user()->id);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        // return $tableData;
        return Inertia::render('user-dashboard/orders/Index', [
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
    public function show(Order $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(403, 'Unauthorized resource');
        }

        if ($user_order->status == 'pending' && $user_order->transaction_id == null) {
            $tran_id = uniqid();
            $user_order->update(
                [
                    'tran_id' => $tran_id,
                ]
            );
        } else {
            $tran_id = $user_order->tran_id;
        }

        $currency = $user_order->currency;
        $continue_success_url = env('APP_URL') . "/kess/success";

        // $amount = $user_order->total_amount - $user_order->shipping_price;
        // $shipping = $user_order->shipping_price;
        // $email = $user_order->buyer->email;
        // $req_time = $user_order->req_time;
        // $merchant_id = config('payway.merchant_id');
        // $payment_option = 'abapay_khqr'; // or any default payment option if needed
        // $skip_success_page = 1; // or any default payment option if needed
        // $return_url = env('APP_URL') . "/kess/callback";
        // $return_params ='payment_success';


        $paymentLink = null;
        if ($user_order->status == 'pending') {
            // Start KESS Payment
            $merchant = new Merchants();

            // You can test either createOrder() or queryOrder()
            $result = $merchant->createOrder($tran_id, $user_order->total_amount, $currency, $continue_success_url, $user_order->id);

            // Decode JSON if it's a string
            if (is_string($result)) {
                $decoded = json_decode($result, true);
                $result = $decoded ?? ['raw' => $result];
            }

            $paymentLink = $result['data']['payment_link'] ?? null;
            // dd($paymentLink);
        }

        return Inertia::render('user-dashboard/orders/Show', [
            'order_detail' => $user_order->load('order_items.item.images', 'shop'),
            'readOnly' => true,
            'paymentLink' => $paymentLink,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Item $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(404);
        }
        $editData = $user_order->load('order_items.item.images');
        dd($editData);
        return Inertia::render('user-dashboard/orders/Create', [
            'editData' => $editData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
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
    public function destroy(Order $user_order)
    {
        if ($user_order->user_id != Auth::user()->id) {
            abort(404);
        }
        if ($user_order->status != 'pending') {
            abort(403, 'Cannot delete: status is not pending');
        }

        $user_order->delete();
        return redirect()->back()->with('success', 'Order deleted successfully.');
    }
}
