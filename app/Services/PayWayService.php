<?php
// app/Services/PayWayService.php

namespace App\Services;

class PayWayService
{
    /**
     * Get the API URL from the configuration.
     *
     * @return string
     */
    public function getApiUrl()
    {
        return config('payway.api_url');
    }

    /**
     * Generate the hash for PayWay security.
     *
     * @param string $str
     * @return string
     */
    public function getHash($str)
    {
        $key = config('payway.api_key');
        return base64_encode(hash_hmac('sha512', $str, $key, true));
    }

    public function opensslEncryption($source, $publicKey)
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

    public function curl($url, array $header, string $jsonData)
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
}
