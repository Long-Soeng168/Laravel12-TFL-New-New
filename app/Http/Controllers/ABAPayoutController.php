<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payout;
use App\Models\QueueJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ABAPayoutController extends Controller
{
    protected function opensslEncryption(string $source, string $publicKey): string
    {
        // Assumes 1024 bit key and encrypts in chunks.
        $maxlength = 117;
        $output = '';
        while ($source) {
            $input = substr($source, 0, $maxlength);
            $source = substr($source, $maxlength);
            openssl_public_encrypt($input, $encrypted, $publicKey);
            $output .= $encrypted;
        }
        return base64_encode($output);
    }

    protected function sendRequest(string $url, array $header, string $jsonData)
    {
        $curl = curl_init();

        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $jsonData,
            CURLOPT_HTTPHEADER => $header,
        ]);

        $response = curl_exec($curl);

        if (curl_errno($curl)) {
            Log::error('PayWay Payout CURL Error: ' . curl_error($curl));
        }

        curl_close($curl);

        return $response;
    }

    public function payout($id)
    {
        $order = Order::where('id', $id)->with('shop')->first();

        if (!$order) {
            return back()->with('error', 'Order not found.');
        }

        if ($order->payout_status === 'paid') {
            return back()->with('warning', 'Order already payout.');
        }
        if ($order->status !== 'paid') {
            return back()->with('warning', 'Order not paid.');
        }

        // if ($order->status !== 'completed') {
        //     return back()->with('warning', 'Order not completed.');
        // }


        if (empty($order->shop?->bank_account)) {
            return back()->with('warning', 'Shop has invalid ABA Bank Account!');
        }

        // PayWay config
        $apiKey     = config('payway.api_key');
        $merchantId = config('payway.merchant_id');
        $publicKey  = config('payway.rsa_public_key');

        // Bank info
        $shop_bank_account     = $order->shop?->bank_account; // replace with shop account if dynamic
        $shipping_bank_account = env('ABA_DELIVERY_BANK_ACCOUNT');
        $currency              = 'USD';


        // Amount calculations
        $total_amount            = $order->total_amount;
        $shipping_receive_amount = $order->shipping_price ?? 0;
        $commission_percentage   = 0.03; // 3%
        $amount_after_shipping   = $total_amount - $shipping_receive_amount;
        $website_receive_amount  = $amount_after_shipping * $commission_percentage;
        $shop_receive_amount     = $amount_after_shipping - $website_receive_amount;
        $total_payout = (($shop_receive_amount * 100) + ($shipping_receive_amount * 100)) / 100;


        // return [$shop_bank_account, $shipping_bank_account, $shop_receive_amount, $shipping_receive_amount, $website_receive_amount, $total_amount, $total_payout];


        // Generate unique transaction ID
        $merchantTranId = 'A' . (microtime(true) * 10000);

        // Beneficiaries array
        $beneficiaries = [
            ['account' => $shop_bank_account, 'amount' => (float) $shop_receive_amount],
            ['account' => $shipping_bank_account, 'amount' => (float) $shipping_receive_amount],
        ];
        $merchantDataInfo = json_encode($beneficiaries);

        // Custom field
        $customField = json_encode([
            'timestamp' => now()->format('Y-m-d H:i:s.u'),
            'traceId'   => md5(uniqid()),
        ]);

        // Encrypt
        $encryptedData = $this->opensslEncryption($merchantDataInfo, $publicKey);

        // Hash
        $b4Hash = $merchantId . $merchantTranId . $encryptedData . $total_payout . $customField . $currency;
        $hash   = hash_hmac('sha512', $b4Hash, $apiKey);

        // Request
        $header   = ['language: en', 'Content-Type: application/json'];
        $jsonData = [
            'merchant_id'   => $merchantId,
            'tran_id'       => $merchantTranId,
            'beneficiaries' => $encryptedData,
            'amount'        => $total_payout,
            'currency'      => $currency,
            'custom_fields' => $customField,
            'hash'          => $hash,
            'b4hash'        => $b4Hash,
        ];

        $url      = config('payway.base_api_domain') . '/api/payment-gateway/v2/direct-payment/merchant/payout';
        $response = $this->sendRequest($url, $header, json_encode($jsonData));
        $decodedResponse = json_decode($response, true);

        $job = QueueJob::where('order_id', $id)->first();
        
        if ($job) {
            $job->update([
                'respone_log' => json_encode($decodedResponse),
            ]);
        };

        // If successful, create payout record
        if (isset($decodedResponse['status']['code']) && $decodedResponse['status']['code'] === '0') {
            Payout::create([
                'shop_id'                => $order->shop_id,
                'order_id'               => $order->id,
                'total_amount'           => $total_amount,
                'shipping_receive_amount' => $shipping_receive_amount,
                'shipping_bank_account'  => $shipping_bank_account,
                'shop_bank_account'      => $shop_bank_account,
                'commission'             => $website_receive_amount,
                'shop_receive_amount'    => $shop_receive_amount,
                'website_receive_amount' => $website_receive_amount,
                'req_time'               => now()->format('YmdHis'),
                'payout_status'          => 'paid', // mark as paid since successful
                'tran_id'                => $merchantTranId,
                'trace_id'               => json_decode($customField, true)['traceId'],
                'payout_ref'             => $decodedResponse['transaction_id'] ?? null,
                'response_data'          => json_encode($decodedResponse),
            ]);

            // Update order payout status
            $order->update(['payout_status' => 'paid']);
        } else {
            // dd($decodedResponse);
            return back()->with('error', 'Payout Error');
        }
        return back()->with('success', 'Payout Successfully');
        // Log::info('PayWay Payout Response', [
        //     'url'      => $url,
        //     'request'  => $jsonData,
        //     'response' => $decodedResponse,
        // ]);

        // return response()->json([
        //     'url'      => $url,
        //     'header'   => $header,
        //     'request'  => $jsonData,
        //     'response' => $decodedResponse,
        // ]);
    }
}
