<?php

use App\Http\Controllers\ABAPayoutController;
use App\Http\Controllers\ABAPaywayCheckout;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;


Route::post('/orders', [OrderController::class, 'store']);
Route::post('/orders/{id}/payout', [ABAPayoutController::class, 'payout']);
Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);


// Testing
Route::get('/showTestCheckoutForm', [ABAPaywayCheckout::class, 'showTestCheckoutForm']);

// Start Using
Route::get('/shopping-cart', [ABAPaywayCheckout::class, 'shopping_cart'])->middleware('auth');

Route::post('/aba/get-hash', [ABAPaywayCheckout::class, 'get_hash']);

// Route::post('/aba/callback', [ABAPaywayCheckout::class, 'callback']);
Route::get('/aba/callback', [ABAPaywayCheckout::class, 'callback']);

Route::get('/aba/success', [ABAPaywayCheckout::class, 'success']);
Route::get('/aba/cancel', [ABAPaywayCheckout::class, 'cancel']);
