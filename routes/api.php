<?php

use App\Http\Controllers\ABAPaymentController;
use App\Http\Controllers\ABAPayoutController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\BodyTypeController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\DtcController;
use App\Http\Controllers\Api\FileExploreController;
use App\Http\Controllers\Api\GarageController;
use App\Http\Controllers\Api\GaragePostController;
use App\Http\Controllers\Api\LinkController;
use App\Http\Controllers\Api\ModelController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\VideoController;
use Illuminate\Support\Facades\Route;

Route::post('/api/orders/{id}/payout', [ABAPayoutController::class, 'payout']);


Route::get('/links', [LinkController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/pages', [PageController::class, 'index']);

// Post Route
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts_most_views', [PostController::class, 'posts_most_views']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::get('/post_categories', [PostController::class, 'post_categories']);

// Documents Route
Route::get('/file-explorer/folder/{path}', [FileExploreController::class, 'folder']);

// DTC Route
Route::resource('dtcs', DtcController::class);

// Course Route
Route::resource('courses', CourseController::class);

// Slide Route
Route::resource('slides', SlideController::class);

// Video Route
Route::resource('videos', VideoController::class);
Route::get('videos_playlists', [VideoController::class, 'video_playlists']);

// Shop Route
Route::resource('shops', ShopController::class);

// Garage Route
Route::resource('garages', GarageController::class);
Route::resource('garages_posts', GaragePostController::class);

// Product Route
Route::resource('products', ProductController::class);
Route::get('related_products/{id}', [ProductController::class, 'relatedProducts']);
Route::resource('categories', CategoryController::class);
Route::resource('body_types', BodyTypeController::class);
Route::resource('brands', BrandController::class);
Route::resource('models', ModelController::class);


Route::middleware(['auth:sanctum'])->group(function () {
    // Shop Route
    Route::post('user_shop', [ShopController::class, 'user_shop']);
    Route::post('shops', [ShopController::class, 'store']);
    Route::post('shops/{id}', [ShopController::class, 'update']);
    Route::post('products', [ShopController::class, 'storeProduct']);
    Route::post('products/{id}', [ShopController::class, 'updateProduct']);
    Route::get('products/{id}/delete', [ShopController::class, 'deleteProduct']);

    // Garage Route
    Route::post('user_garage', [GarageController::class, 'user_garage']);
    Route::post('garages', [GarageController::class, 'store']);
    Route::post('garages/{id}', [GarageController::class, 'update']);
    Route::post('garages_posts', [GaragePostController::class, 'store']);
    Route::post('garages_posts/{id}', [GaragePostController::class, 'update']);
    // Route::get('garages_posts/{id}/delete', [GaragePostController::class, 'destroy']);
});


// Auth API Route
require __DIR__ . '/api_auth.php';

// Route::post('/complete', '\App\Http\Controllers\PayPalController@complete');


Route::post('/payway/purchase', [ABAPaymentController::class, 'purchase']);


use Illuminate\Support\Facades\Http;

Route::post('/bakong/check', function (\Illuminate\Http\Request $request) {
    $token = env('BAKONG_API_TOKEN'); // store securely in .env
    $md5 = $request->input('md5');

    $response = Http::withToken($token)->post('https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5', [
        'md5' => $md5,
    ]);

    return response()->json($response->json(), $response->status());
});
