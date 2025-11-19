<?php

namespace App\Http\Controllers;

use Exception;

class Merchants
{


    public function get_configs()
    {
        $configs = [
            'url'               => env("KESS_API_URL"),
            'username'          => env("LOCAL_USERNAME"),
            'password'          => env("LOCAL_PASSWORD"),
            'client_id'         => env("LOCAL_CLIENT_ID"),
            'client_secret'     => env("LOCAL_CLIENT_SECRET"),
            'seller_code'       => env("LOCAL_SELLER_CODE"),
            'api_secret_key'    => env("LOCAL_API_SECRET_KEY"),
        ];

        return $configs;
    }

    public function createOrder($tran_id, $total_amount, $currency, $continue_success_url)
    {
        $params = [
            "service" => "webpay.acquire.createOrder",
            "sign_type" => "MD5",
            "seller_code" => $this->get_configs()['seller_code'],
            "out_trade_no" => $tran_id,
            "body" => "TEST_PAYMENT_395465",
            "total_amount" => $total_amount,
            "currency" => $currency,
            "notify_url" => "",
            "redirect_url" => $continue_success_url,
            "expires_in" => 3600
        ];

        dd($params);
        $params['sign'] = $this->signature($params, $this->get_configs()['api_secret_key']);

        $url = $this->get_configs()['url'] . '/api/mch/v2/gateway';

        try {
            $resp = $this->callHttp($url, $params);
            $this->verifySignatureForResponse($resp["sign"], $resp["sign_type"], $resp["data"], $this->get_configs()['api_secret_key']);
            return json_encode($resp);
        } catch (\Throwable $th) {
            // print_r($th);
            dd($th);
        }
    }

    public function queryOrder($out_trade_no)
    {

        $params = [
            "service" => "webpay.acquire.queryOrder",
            "sign_type" => "MD5",
            "out_trade_no" => $out_trade_no
        ];

        $params['sign'] = $this->signature($params, $this->get_configs()['api_secret_key']);

        $url = $this->get_configs()['url'] . '/api/mch/v2/gateway';

        try {
            $resp = $this->callHttp($url, $params);
            $this->verifySignatureForResponse($resp["sign"], $resp["sign_type"], $resp["data"], $this->get_configs()['api_secret_key']);
            return $resp;
        } catch (\Throwable $th) {
            print_r($th);
        }
    }


    public function getToken()
    {


        if (isset($_COOKIE['access_token'])) {
            return $_COOKIE['access_token'];
        }



        $params = [
            'grant_type' => "password",
            'client_id' => $this->get_configs()['client_id'],
            'client_secret' => $this->get_configs()['client_secret'],
            "username" => $this->get_configs()['username'],
            "password" => $this->get_configs()['password'],
        ];

        $url = $this->get_configs()['url'] . '/oauth/token';


        try {
            $resp = $this->callHttp($url, $params);

            setcookie('access_token', $resp['access_token'], $resp['expires_in'] - 100);
            return $resp['access_token'];
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function callHttp($url, $params)
    {

        try {

            $headers = ["Content-Type: application/json"];
            if (!str_contains($url, "oauth/token") && $token = $this->getToken()) {
                $headers[] =  "Authorization: Bearer " . $token;
            }

            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($params),
                CURLOPT_HTTPHEADER =>  $headers,
                CURLOPT_SSL_VERIFYPEER => false
            ));

            $response = curl_exec($curl);

            if ($response === false) {
                throw new Exception(curl_error($curl));
            }

            curl_close($curl);

            return json_decode($response, true);
        } catch (\Throwable $th) {
            throw $th;
        }
    }


    public function signature(array $params, $api_secret_key)
    {
        $signType = $params['sign_type'] ?? "MD5";

        $string = $this->toUrlParams($params);
        $string = $string . "&key=" . $api_secret_key;

        if ($signType == "MD5")
            $string = md5($string);
        else if ($signType == "HMAC-SHA256")
            $string = hash_hmac("sha256", $string, $api_secret_key);

        return $string;
    }

    public function toUrlParams(array $values)
    {
        ksort($values);

        $values = array_filter($values, function ($var) {
            return !is_null($var);
        });

        $buff = "";

        foreach ($values as $k => $v) {
            if ($k != "sign" && $v !== "" && !is_array($v) && !is_object($v)) {
                $buff .= $k . "=" . $v . "&";
            }
        }

        $buff = trim($buff, "&");

        return $buff;
    }

    public function verifySignatureForResponse($sign, $signType, $data, $api_secret_key)
    {

        $string = $this->toUrlParams((array)$data);
        $string = $string . "&key=" . $api_secret_key;

        if ($signType == "MD5") {
            $string = md5($string);
        } else if ($signType == "HMAC-SHA256") {
            $string = hash_hmac("sha256", $string, $api_secret_key);
        }

        if (strtoupper($sign) != strtoupper($string)) {
            throw new Exception("Invalid sign", 400);
        }

        return true;
    }

    public function getPublicKey()
    {
        // return string public key
        return "";
    }



    public function encrypt(array $params)
    {
        $rawText = json_encode($params);
        openssl_public_encrypt($rawText, $encrypted, $this->getPublicKey());
        return bin2hex($encrypted);
    }
}
