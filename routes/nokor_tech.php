<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\NokorTechController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [NokorTechController::class, 'index']);
Route::get('/shops', [NokorTechController::class, 'shops']);
Route::get('/shop-terms-and-conditions', [NokorTechController::class, 'shop_terms_and_conditions']);
Route::get('/about-us', [NokorTechController::class, 'about']);
Route::get('/download-app', [NokorTechController::class, 'download_app']);
Route::get('/download_app', [NokorTechController::class, 'download_app']);
Route::get('/privacy', [NokorTechController::class, 'privacy']);

Route::get('/contact-us', [NokorTechController::class, 'contact']);
Route::post('/submit-message', [MessageController::class, 'store']);

Route::get('/online_trainings', [NokorTechController::class, 'online_trainings']);
Route::get('/online_trainings/{id}', [NokorTechController::class, 'online_training_show']);

Route::get('/blogs', [NokorTechController::class, 'blogs']);
Route::get('/blogs/{id}', [NokorTechController::class, 'blog_show']);

Route::get('/products', [NokorTechController::class, 'products']);
Route::get('/products/{id}', [NokorTechController::class, 'product_show']);

Route::get('/shops/{id}', [NokorTechController::class, 'shop_show']);

Route::middleware('auth')->group(function () {
    Route::get('/checkout', [NokorTechController::class, 'checkout']);
});
Route::get('/checkout_success', [NokorTechController::class, 'success']);

// Route::get('/documents', [NokorTechController::class, 'documents']);