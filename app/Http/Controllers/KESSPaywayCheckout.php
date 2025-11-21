<?php

namespace App\Http\Controllers;

use App\Helpers\TelegramHelper;
use App\Jobs\ProcessQueueJob;
use App\Models\Order;
use App\Models\QueueJob;
use App\Services\PayWayService;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class KESSPaywayCheckout extends Controller
{

    protected $payWayService;

    public function __construct(PayWayService $payWayService)
    {
        $this->payWayService = $payWayService;
    }

    public function shopping_cart()
    {
        $req_time = date('YmdHis'); // UTC time format
        $merchant_id = config('payway.merchant_id');
        $tran_id = uniqid();

        return Inertia::render("nokor-tech/cart/ShoppingCart", [
            'req_time' => $req_time,
            'shipping' => env('SHIPPING_PRICE_USD') ?? 0,
            'currency' => "USD",
            'paymentOption' => "kess_webpay",
            'merchant_id' => $merchant_id,
            'tran_id' => $tran_id,
            'app_url' => config('app.url'),
            'api_url' => config('payway.api_url'), // Assuming this is defined elsewhere
        ]);
    }

    public function cancel(Request $request)
    {
        $order = Order::where('tran_id', $request->tran_id)->firstOrFail();
        // Authorization
        if ($request->user()->id != $order->user_id) {
            abort(403, 'Unauthorized action.');
        }

        if ($order->status != 'pending') {
            abort(403, 'Cannot delete: status is not pending');
        }

        $order->delete();
        return redirect('/shopping-cart?user_cancel=1');
    }
    public function success(Request $request)
    {
        return redirect("/user-orders/{$request->order_id}?order_success=1&order_id=" . $request->order_id);
    }
    public function callback(Request $request)
    {
        $order = Order::findOrFail($request->order_id);

        if ($order->status == 'pending' && $order->payment_status != 'SUCCESS') {
            $order->update([
                'notes'                 => 'Requested',
                'status'                => $request->input('status') == 'SUCCESS' ? 'paid' : 'pending',
                'payment_status'        => $request->input('status', 'UNKNOWN'),
                'tran_id'               => $request->input('out_trade_no', $order->tran_id),
                'transaction_id'        => $request->input('transaction_id', $order->transaction_id),
                'payment_method_bic'    => $request->input('payment_detail.payment_method_bic', 'UNKNOWN'),
                'transaction_detail'    => $request->all(), // <-- careful here
            ]);

            if ($order->notify_telegram_status != 'completed') {

                $result = TelegramHelper::sendOrderNotification($order);

                if ($result['success'] === true) {
                    $order->update([
                        'notify_telegram_status' => 'completed'
                    ]);
                } else {
                    $order->update([
                        'notify_telegram_status' => 'failed'
                    ]);
                    Log::warning('Telegram notify failed for order ' . $order->id . ': ' . $result['message']);
                }
            }
        }

        return response()->json([
            'message' => 'Success',
            'request' => $request->all(),
        ]);
    }
    public function get_order_transaction(Request $request)
    {
        $order = Order::findOrFail($request->order_id);

        if ($order->status == 'pending' && $order->payment_status != 'SUCCESS') {
            $merchant = new Merchants();

            // You can test either createOrder() or queryOrder()
            $result = $merchant->queryOrder($order->tran_id);

            // Decode JSON if it's a string
            if (is_string($result)) {
                $decoded = json_decode($result, true);
                $result = $decoded ?? ['raw' => $result];
            }
            if (is_object($result)) {
                $result = json_decode(json_encode($result), true);
            }
            $data = $result['data'] ?? [];


            if ($data) {
                $order->update([
                    'notes'              => 'Recheck Transaction Requested',

                    // status might not exist in this structure at all
                    'status'             => ($data['status'] ?? null) === 'SUCCESS' ? 'paid' : 'pending',
                    'payment_status'     => $data['status'] ?? 'UNKNOWN',

                    'tran_id'            => $data['out_trade_no']   ?? $order->tran_id,
                    'transaction_id'     => $data['transaction_id'] ?? $order->transaction_id,

                    // this structure does NOT contain payment_detail anymore
                    'payment_method_bic' => $data['payment_detail']['payment_method_bic'] ?? null,

                    // store only the `data` section
                    'transaction_detail' => $data,
                ]);
            }

            if ($order->notify_telegram_status != 'completed' && ($data['status'] ?? null) === 'SUCCESS') {

                $telegram_notify_result = TelegramHelper::sendOrderNotification($order);

                if ($telegram_notify_result['success'] === true) {
                    $order->update([
                        'notify_telegram_status' => 'completed'
                    ]);
                } else {
                    $order->update([
                        'notify_telegram_status' => 'failed'
                    ]);
                    Log::warning('Telegram notify failed for order ' . $order->id . ': ' . $telegram_notify_result['message']);
                }
            }
        }



        return response()->json([
            'message' => 'Success',
            'request' => $result,
        ]);
    }
}
