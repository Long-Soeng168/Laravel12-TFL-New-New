<?php

use Illuminate\Support\Facades\Route;
use App\Notifications\SendTelegramGroupNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Http;

// Testing Telegram Bot
Route::get('/test-telegram', function () {
    try {
        Notification::route('telegram', env('TELEGRAM_GROUP_CHAT_ID'))
            ->notify(new SendTelegramGroupNotification("🔥 Hello world? message from laravel app!"));
        return 'Telegram send success';
    } catch (\Exception $e) {
        return 'Telegram send failed: ' . $e->getMessage();
    }
});

Route::get('/send-telegram-album', function () {
    $token = env('TELEGRAM_BOT_TOKEN');
    $chatId = env('TELEGRAM_GROUP_CHAT_ID');

    $media = [
        [
            'type' => 'photo',
            'media' => 'https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg',
            'caption' => "🚀 <b>Here's an awesome photo album for you!</b>\n\nCheck out these incredible Tesla models that are reshaping the future of transportation!\n\n- <a href='https://www.tesla.com/modelx'>Model X</a> - <i>The Future of Family Transport</i>\n- <a href='https://www.tesla.com/cybertruck'>Cybertruck</a> - <b>The rugged powerhouse</b>\n\nStay tuned for more updates and amazing features! 😎\n\n#Tesla #Innovation #FutureOfTransport",
            'parse_mode' => 'HTML',

        ],
        [
            'type' => 'photo',
            'media' => 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-X-Desktop.png',
        ],
        [
            'type' => 'photo',
            'media' => 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Cybertruck-Desktop.png',
        ],
        [
            'type' => 'photo',
            'media' => 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-S-Desktop.png',
        ],
        [
            'type' => 'photo',
            'media' => 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-X-Desktop.png',
        ],
        [
            'type' => 'photo',
            'media' => 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Cybertruck-Desktop.png',
        ],
        [
            'type' => 'photo',
            'media' => 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-S-Desktop.png',
        ],
    ];

    $response = Http::post("https://api.telegram.org/bot{$token}/sendMediaGroup", [
        'chat_id' => $chatId,
        'media' => json_encode($media),
    ]);
    if ($response->successful()) {
        return 'Album sent!';
    } else {
        return 'Failed: ' . $response->body();
    }
});
