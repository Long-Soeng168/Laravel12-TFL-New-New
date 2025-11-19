<?php

use App\Http\Controllers\ABAPaymentController;
use App\Http\Controllers\ABAPaywayCheckout;
use App\Http\Controllers\Merchants;
use App\Http\Controllers\StreamFileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Default Homepage
Route::get('/', function () {
   // return Inertia::render('LaravelDefaultPage');
   return redirect('/dashboard');
})->name('home');

// Switch Language
Route::get('/lang/{locale}', function ($locale) {
   if (!in_array($locale, ['en', 'kh'])) {
      abort(404);
   }
   session(['locale' => $locale]);
   return redirect()->back();
});

// Stream File
Route::get('show_pdf_file/{path}', [StreamFileController::class, 'streamPdf'])->where('path', '.*');

// ========= Client =========
require __DIR__ . '/nokor_tech.php';



// ========= Admin =========
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

require __DIR__ . '/user-dashboard.php';
require __DIR__ . '/admin.php';

require __DIR__ . '/file_manager.php';
require __DIR__ . '/order.php';


// ========= Queues Jobs =========
use App\Http\Controllers\QueueJobController;

Route::get('/queue_jobs', [QueueJobController::class, 'index']);
Route::post('/queue_job/start', [QueueJobController::class, 'start']);
Route::get('/queue_job/{queueJob}', [QueueJobController::class, 'show']);
Route::post('/queue_job/{queueJob}/execute', [QueueJobController::class, 'execute']);



// ========= Telegram Testing Route =========
require __DIR__ . '/telegram.php';

// ========= Pay Pal Route =========
Route::get('/paypal_payment', '\App\Http\Controllers\PayPalController@index')->middleware('auth');
Route::get('/create/{amount}', '\App\Http\Controllers\PayPalController@create');
Route::post('/complete', '\App\Http\Controllers\PayPalController@complete');

// Stripe Payment Route
Route::get('/test_stripe', 'App\Http\Controllers\StripeController@checkout')->name('checkout');
Route::get('/test', 'App\Http\Controllers\StripeController@test');
Route::post('/live', 'App\Http\Controllers\StripeController@live');
Route::get('/success/{id}', 'App\Http\Controllers\StripeController@success')->name('success');

// ABA Payemnt Route
Route::get('/aba_test_checkout', [ABAPaywayCheckout::class, 'showTestCheckoutForm']);

Route::get('/pdf_viewer', function () {
   return view('pdf_viewer');
});

Route::get('/qr', function () {
   return Inertia::render('QRPage');
});

Route::get('/payment', function () {
   return Inertia::render('ABAPaymentPage');
});
Route::get('/bakong', function () {
   return view('bakong', [
      'order_number' => '7777', // dynamic or from session/cart
   ]);
});
Route::get('/paymentBakong/success', function () {
   return view('bakong_success');
});



// KESS

Route::get('/test-payment', function () {
   $merchant = new Merchants();

   $tran_id = 'tran_id_12345';
   $currency = 'USD';
   $continue_success_url = env('APP_URL') . "/kess/success";

   // You can test either createOrder() or queryOrder()
   $result = $merchant->createOrder($tran_id, 1, $currency, $continue_success_url);

   // Decode JSON if it's a string
   if (is_string($result)) {
      $decoded = json_decode($result, true);
      $result = $decoded ?? ['raw' => $result];
   }

   // Now safely check for payment link
   $paymentLink = $result['data']['payment_link'] ?? null;

   // dd($paymentLink);

   if ($paymentLink) {
      return view('kess_pay', [
         'result' => $result,
         'paymentLink' => $paymentLink
      ]);
   }

   return response()->json([
      'error' => $result['message'] ?? 'Failed to create payment order',
      'data' => $result
   ], 400);
});

Route::post('/test-create-order', function () {
   $merchant = new \App\Http\Controllers\Merchants();
   $result = $merchant->createOrder();
   return back()->with(['result' => $result]);
});
