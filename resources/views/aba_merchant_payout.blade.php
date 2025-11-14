<?php

function opensslEncryption($source, $publicKey)
{
    //Assumes 1024 bit key and encrypts in chunks.
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

function curl($url, array $header, string $jsonData)
{
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_SSL_VERIFYPEER => 0,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $jsonData,
        CURLOPT_HTTPHEADER => $header,
    ));

    $response = curl_exec($curl);
    curl_close($curl);

    return $response;
}

$api_key = config('payway.api_key');

$merchant_key = config('payway.merchant_id');
$merchant_tran_id = 'A' . (microtime(true) * 10000);

$merchant_data_info = json_encode([
    ['account' => '500000001', 'amount' => 0.5],
    ['account' => '500000002', 'amount' => 0.5],
]);

$currency = 'USD';
$amount = 1;

$customField = '{"timestamp":"2024-08-23 10:35:55.437","traceId":"63f9645fa3bd8678907ed4c038357385"}';

$merchant_data = opensslEncryption(
    $merchant_data_info,
    config('payway.rsa_public_key')
);

$b4Hash = $merchant_key . $merchant_tran_id . $merchant_data . $amount . $customField . $currency;

$hash = hash_hmac('sha512', $b4Hash, $api_key);

$header = ['language: en', 'Content-Type: application/json'];
$jsonData = [
    "merchant_id" => $merchant_key,
    "tran_id" => $merchant_tran_id,
    "beneficiaries"  => $merchant_data,
    "amount" => $amount,
    "currency" => $currency,
    "custom_fields"  => $customField,
    "hash" => $hash,
    "b4hash" => $b4Hash,
];

$url = config('payway.base_api_domain') . '/api/payment-gateway/v2/direct-payment/merchant/payout';

$response = curl($url, $header, json_encode($jsonData));

echo '<pre>';
echo json_encode(
    [
        'url' => $url,
        'header' => $header,
        'request' => $jsonData,
        'response' => json_decode($response)
    ],
    JSON_PRETTY_PRINT
);
echo '</pre>';
