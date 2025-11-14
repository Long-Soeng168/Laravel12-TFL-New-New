<?php
// config/payway.php
return [
    'api_url' => env('ABA_PAYWAY_API_URL', 'https://checkout.payway.com.kh/api/payment-gateway/v1/payments/purchase'),
    'base_api_domain' => env('ABA_BASE_API_DOMAIN', 'https://checkout.payway.com.kh'),
    // 'api_key' => env('ABA_PAYWAY_API_KEY', 'e72b3ee6918c544f42af460db2ffc9c77d9ca645'),
    // 'merchant_id' => env('ABA_PAYWAY_MERCHANT_ID', 'ec461385'),
    'api_key' => env('ABA_PAYWAY_API_KEY', '51ee1291-e350-4769-9e2a-1371bec8ef7f'),
    'merchant_id' => env('ABA_PAYWAY_MERCHANT_ID', 'ec437721'),
    'rsa_public_key' => env('ABA_RSA_PUBLIC_KEY', '-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4Rb7V4kFlEi4SBGCtLDs7k/iu
zGide8dFj01Vo3pSGDwAlgM9WXYdVHtttqirYXYgHrVOR3+LuMy0VVdh6+xGEmQn
kfi8fQUd0h8c2OlwAqhMAZhZduSqHt1nHfJPgqPIeOXsNe6pwpVAS4ntRfSVhFYI
k7YLVFXuMo11DOGgPwIDAQAB
-----END PUBLIC KEY-----'),
];
