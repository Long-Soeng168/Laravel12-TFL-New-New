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

    public function get_hash(Request $request)
    {
        $request->validate([
            'hash_string' => 'required|string',
        ]);

        $hash = $this->payWayService->getHash($request->hash_string);

        return response()->json([
            'code' => '00',
            'message' => 'Success!',
            'hash' => $hash,
        ]);
    }
    public function shopping_cart()
    {
        $req_time = date('YmdHis'); // UTC time format
        $merchant_id = config('payway.merchant_id');
        $tran_id = uniqid();

        // $hashString = $req_time . 'pgmarket68e5ded23d68a482abapay_khqrhttps://pgmarket.corasolution.com/aba/callback?tran_id=68e5ded23d68ahttps://pgmarket.corasolution.com/aba/cancel?tran_id=68e5ded23d68ahttps://pgmarket.corasolution.com/aba/success?tran_id=68e5ded23d68aUSD1';
        // $hash = $this->payWayService->getHash($hashString);

        // dd($merchant_id);
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

    // End Payment Gateway

    public function showTestCheckoutForm()
    {
        $tran_id = 'TXN001234567';
        $amount = '1.00';
        $shipping = '2.00';
        $email = 'sokha.tim@ababank.com'; // or any default payment option if needed
        $req_time = date('YmdHis');
        $merchant_id = config('payway.merchant_id');
        $payment_option = 'abapay_khqr'; // or any default payment option if needed
        $return_url = env('APP_URL') . "/aba/callback?tran_id={$tran_id}";
        $cancel_url = env('APP_URL') . "/aba/cancel?tran_id={$tran_id}";
        $continue_success_url = env('APP_URL') . "/aba/success?tran_id={$tran_id}";
        // $return_params ='payment_success';
        $hash = $this->payWayService->getHash(
            $req_time . $merchant_id . $tran_id . $amount . $shipping .
                $email . $payment_option . $return_url . $cancel_url . $continue_success_url
        );

        return view('aba_test_checkout', compact(
            'hash',
            'tran_id',
            'amount',
            'shipping',
            'email',
            'payment_option',
            'merchant_id',
            'req_time',
            'return_url',
            'cancel_url',
            'continue_success_url',
        ));
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
        $merchant = new Merchants();

        $result = $merchant->queryOrder($request->out_trade_no);

        $payment_status = $result['data']['status'];

        $order = Order::where('tran_id', $request->out_trade_no)->first();
        $order->update([
            'status' => $payment_status == 'SUCCESS' ? 'paid' : 'pending',
            'payment_status' => $payment_status,
            'transaction_detail' => $result['data'],
            'transaction_id' => $result['data']['transaction_id'],
        ]);

        // dd($order->notify_telegram_status);
        if ($order->notify_telegram_status != 'completed') {

            $result = TelegramHelper::sendOrderNotification($order);

            if ($result['success'] === true) {
                // Telegram sent — mark completed
                $order->update([
                    'notify_telegram_status' => 'completed'
                ]);
            } else {
                // Telegram failed — mark failed
                $order->update([
                    'notify_telegram_status' => 'failed'
                ]);

                // optional: log it
                Log::warning('Telegram notify failed for order ' . $order->id . ': ' . $result['message']);
            }
        }


        if ($order) {
            return redirect("/user-orders/{$order->id}?order_success=1&order_id=" . $order->id);
        } else {
            return redirect('/shopping-cart?order_fail=1');
        }

        // return response()->json([
        //     'message' => 'Success',
        //     'request' => $request->all(),
        // ]);
    }
    public function callback(Request $request)
    {
        $order = Order::where('tran_id', $request->out_trade_no)->first();


        if ($order->status == 'pending' && $order->payment_status != 'SUCCESS') {
            $merchant = new Merchants();
            $result = $merchant->queryOrder($request->out_trade_no);
            $payment_status = $result['data']['status'];
            $order->update([
                'status' => $payment_status == 'SUCCESS' ? 'paid' : 'pending',
                'payment_status' => $payment_status,
            ]);
        }

        // dd($order->notify_telegram_status);
        if ($order->notify_telegram_status != 'completed') {

            $result = TelegramHelper::sendOrderNotification($order);

            if ($result['success'] === true) {
                // Telegram sent — mark completed
                $order->update([
                    'notify_telegram_status' => 'completed'
                ]);
            } else {
                // Telegram failed — mark failed
                $order->update([
                    'notify_telegram_status' => 'failed'
                ]);

                // optional: log it
                Log::warning('Telegram notify failed for order ' . $order->id . ': ' . $result['message']);
            }
        }


        // if ($order) {
        //     return redirect("/user-orders/{$order->id}?order_success=1&order_id=" . $order->id);
        // } else {
        //     return redirect('/shopping-cart?order_fail=1');
        // }

        return response()->json([
            'message' => 'Success',
            'request' => $request->all(),
        ]);
    }
}
