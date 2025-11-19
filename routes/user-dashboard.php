<?php

use App\Http\Controllers\ABAPaywayCheckout;
use App\Http\Controllers\KESSPaywayCheckout;
use App\Http\Controllers\ShopOrderController;
use App\Http\Controllers\UserDashboard\UserDashboardController;
use App\Http\Controllers\UserDashboard\UserItemController;
use App\Http\Controllers\UserDashboard\UserOrderController;
use App\Http\Controllers\UserDashboard\UserShopController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/user-dashboard', [UserDashboardController::class, 'index']);
    // Item Route
    Route::resource('user-orders', UserOrderController::class);
    Route::resource('user-items', UserItemController::class);
    Route::post('user-items/{user_item}/update', [UserItemController::class, 'update']);
    Route::post('user-items/{user_item}/update_status', [UserItemController::class, 'update_status']);
    Route::delete('user-items/images/{image}', [UserItemController::class, 'destroy_image']);
    Route::get('admin/item_view_counts', [UserItemController::class, 'item_view_counts']);

    // Shop Route
    Route::resource('shop-orders', ShopOrderController::class);
    Route::get('user-shops/update', [UserShopController::class, 'edit']);
    Route::get('user-shops/create', [UserShopController::class, 'create']);
    Route::post('user-shops', [UserShopController::class, 'store']);
    Route::post('user-shops/{user_shop}/update', [UserShopController::class, 'update']);
});

Route::get('/shopping-cart', [KESSPaywayCheckout::class, 'shopping_cart'])->middleware('auth');
Route::get('/kess/success', [KESSPaywayCheckout::class, 'success']);

// Route::get('/kess/callback', [KESSPaywayCheckout::class, 'callback']);
// Route::get('/kess/cancel', [KESSPaywayCheckout::class, 'cancel']);
