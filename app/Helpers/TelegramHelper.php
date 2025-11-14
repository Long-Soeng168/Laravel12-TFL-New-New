<?php

namespace App\Helpers;

use App\Models\OrderItem;
use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramHelper
{
    public static function sendOrderItems($order)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_GROUP_CHAT_ID');
        $isLocalhost = env('TETELGRAM_LOCALHOST');

        if (!$token || !$chatId) {
            return ['success' => false, 'message' => 'Telegram configuration is missing.'];
        }

        try {
            $orderItems = OrderItem::where('order_id', $order->id)->get();
            $media = [];

            foreach ($orderItems as $index => $orderItem) {
                $item = Item::with('images')->find($orderItem->item_id);

                if (!$item || $item->images->isEmpty()) {
                    continue;
                }

                // Assuming images are stored in /assets/images/items/thumb/ accessible via your public URL
                $imageUrl = url('/assets/images/items/thumb/' . $item->images[0]->image);

                $photo = [
                    'type'  => 'photo',
                    'media' => !$isLocalhost ? $imageUrl : 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-S-Desktop.png',
                ];

                if ($index === 0) {
                    $caption  = "🚀 <b>New order ID: {$order->id} placed!</b>\n\n";
                    $caption .= "<b>Name:</b> " . (Auth::user()->name ?? '-') . "\n";
                    $caption .= "<b>Phone:</b> " . Auth::user()->phone . "\n";
                    $caption .= "<b>Note:</b> " . ($order->note ?? '-') . "\n\n";

                    $caption .= "<b>Amount:</b> " .  '$ ' . ($order->total_amount ?? '-') . "\n";
                    $caption .= "<b>Status:</b> " . 'Pending' . "\n";

                    $caption .= "<b>Shop:</b> " . ($order->shop?->name ?? '-') . "\n";

                    $photo['caption']     = $caption;
                    $photo['parse_mode']  = 'HTML';
                }

                $media[] = $photo;
            }

            if (empty($media)) {
                return ['success' => false, 'message' => 'No images found to send.'];
            }

            $response = Http::post("https://api.telegram.org/bot{$token}/sendMediaGroup", [
                'chat_id' => $chatId,
                'media'   => json_encode($media),
            ]);

            // Send button message
            Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => "View Order Detail!",
                'reply_markup' => json_encode([
                    'inline_keyboard' => [
                        [
                            ['text' => 'View Order', 'url' => config('app.url') . "/admin/orders/" . $order->id]
                        ]
                    ]
                ])
            ]);

            if ($response->successful()) {
                return ['success' => true, 'message' => 'Album sent!'];
            } else {
                Log::error('Telegram sendMediaGroup failed: ' . $response->body());
                return ['success' => false, 'message' => 'Failed to send album. ' . $response->body()];
            }
        } catch (\Exception $e) {
            Log::error('Telegram sendOrderItems exception: ' . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()];
        }
    }

    public static function sendItemToTelegram($itemId)
    {
        $token  = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_GROUP_ITEM_CHAT_ID');
        $isLocalhost = env('TETELGRAM_LOCALHOST');

        if (!$token || !$chatId) {
            return ['success' => false, 'message' => 'Telegram configuration is missing.'];
        }

        $item = Item::with('images')->find($itemId);
        if (!$item) {
            return ['success' => false, 'message' => 'Item not found.'];
        }

        if ($item->images->isEmpty()) {
            return ['success' => false, 'message' => 'No images found for this item cannot sent to telegram.'];
        }

        $media = [];

        foreach ($item->images as $index => $image) {
            $imageUrl = url('/assets/images/items/thumb/' . $image->image);

            $photo = [
                'type'  => 'photo',
                'media' => !$isLocalhost ? $imageUrl : 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Card-Model-S-Desktop.png',
            ];

            // Add caption on first image
            if ($index === 0) {
                $caption  = "🔥🔥🔥<b>New Item Arrival!</b>🔥🔥🔥\n\n";
                $caption .= "<b>{$item->name}</b> \n";
                $caption .= ($item->short_description ?? '-') . "\n";

                $photo['caption']     = $caption;
                $photo['parse_mode']  = 'HTML';
            }

            $media[] = $photo;
        }

        $response = Http::post("https://api.telegram.org/bot{$token}/sendMediaGroup", [
            'chat_id' => $chatId,
            'media'   => json_encode($media),
        ]);

        if ($response->successful()) {
            // Send a message with a "View Product" button
            $inlineKeyboard = [
                'inline_keyboard' => [
                    [
                        [
                            'text' => 'View Product',
                            'url'  => url('/products/' . $itemId),
                        ],
                    ],
                ],
            ];

            $message = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id'      => $chatId,
                'text'         => "Click below to view the product", // Zero-width space to avoid visible text
                'reply_markup' => json_encode($inlineKeyboard),
            ]);
        }

        if ($response->successful()) {
            return ['success' => true, 'message' => 'Item posted to Telegram group.'];
        } else {
            return ['success' => false, 'message' => 'Failed to send item. ' . $response->body()];
        }
    }


    public static function sendMessage($message)
    {
        $token  = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_GROUP_CHAT_ID');

        if (!$token || !$chatId) {
            return ['success' => false, 'message' => 'Telegram configuration is missing.'];
        }

        try {
            // Construct the message text
            $text = "📩 *New Message Received:*\n\n"
                . "*Name:* " . ($message->name ?? '-') . "\n"
                . "*Phone:* " . $message->phone . "\n"
                . "*Email:* " . ($message->email ?? '-') . "\n"
                . "*Message:* " . ($message->message ?? '-') . "\n";

            // Send message via Telegram Bot API
            $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id'    => $chatId,
                'text'       => $text,
                'parse_mode' => 'Markdown',
            ]);

            if ($response->successful()) {
                return ['success' => true, 'message' => 'Message sent successfully!'];
            } else {
                Log::error('Telegram Message failed: ' . $response->body());
                return ['success' => false, 'message' => 'Failed to send message. ' . $response->body()];
            }
        } catch (\Exception $e) {
            Log::error('Telegram Message exception: ' . $e->getMessage());
            return ['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()];
        }
    }
}
