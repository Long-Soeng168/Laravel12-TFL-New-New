<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessQueueJob;
use App\Models\Order;
use App\Models\QueueJob;
use App\Services\PayWayService;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request as GuzzleRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ABAPaywayCheckout extends Controller
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

    public function callback(Request $request)
    {
        // return $request->all();
        $order = Order::where('tran_id', $request->tran_id)->firstOrFail();

        $req_time   = $order->req_time; // UTC format from DB
        $merchantId = config('payway.merchant_id');
        $tran_id    = $order->tran_id;

        $hashString = $req_time . $merchantId . $tran_id;
        $hash       = $this->payWayService->getHash($hashString);

        $client = new Client();
        $headers = [
            'Content-Type' => 'application/json'
        ];

        $body = json_encode([
            'req_time'    => $req_time,
            'merchant_id' => $merchantId,
            'tran_id'     => $tran_id,
            'hash'        => $hash,
        ]);

        $guzzleRequest = new GuzzleRequest(
            'POST',
            config('payway.base_api_domain') . '/api/payment-gateway/v1/payments/check-transaction-2',
            $headers,
            $body
        );

        try {
            $res    = $client->send($guzzleRequest);
            $result = json_decode((string) $res->getBody(), true);

            $order->update([
                'transaction_detail' => $result,
            ]);

            $statusCode = $result['status']['code'] ?? null;

            if ($statusCode === '00') {
                $paymentStatus = $result['data']['payment_status'] ?? null;
                $order_status  = $paymentStatus === 'APPROVED' ? 'paid' : 'pending';

                $order->update([
                    'status'            => $order->status == 'pending' ? $order_status : $order->status,
                    'payment_status'    => $paymentStatus,
                ]);

                if ($paymentStatus === 'APPROVED') {

                    $job = QueueJob::where('order_id', $order->id)->first();
                    if ($job) return;

                    $queueJob = QueueJob::create([
                        'job_type' => 'payout_to_shop',
                        'order_id' => $order->id,
                        'payload' => ['order_id' => $order->id, 'order_number' => $order->order_number],
                        'delay_second' => 120, // time delay to run after creation (48h =  48 * 3600)
                        'run_at' => null,           // not started yet
                    ]);

                    // 2️⃣ Dispatch to Laravel queue with delay
                    ProcessQueueJob::dispatch($queueJob)->delay(120);
                }

                return response()->json([
                    'message'  => 'Success',
                    'payment_status' => $paymentStatus,
                    'tran_id'  => $tran_id,
                    'response' => $order,
                ], 200);
            } else {
                Log::warning('ABA callback returned error', [
                    'tran_id' => $order->tran_id,
                    'response' => $result,
                ]);

                return response()->json([
                    'tran_id'  => $tran_id,
                    'response' => $result,
                ], 500);
            }
        } catch (\Throwable $e) {
            Log::error('ABA callback failed', [
                'tran_id' => $order->tran_id,
                'error'   => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to process callback',
                'error'   => $e->getMessage(),
            ], 500);
        }

        // Safe final return
        return response()->json([
            'message'  => 'Success',
            'tran_id'  => $tran_id,
            'status'   => $result['status']['message'] ?? null,
            'response' => $result,
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
        $order = Order::where('tran_id', $request->tran_id)->first();
        // $order->update([
        //     'notes' => json_encode($request->all(), JSON_UNESCAPED_UNICODE),
        // ]);
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
}
