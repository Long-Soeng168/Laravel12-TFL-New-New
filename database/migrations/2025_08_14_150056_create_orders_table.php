<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');

        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->string('order_number', 50)->unique()->comment('Human-readable order code (ORD-YYYYMMDD-XXXX)');

            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('shop_id')
                ->nullable()
                ->constrained('shops')
                ->nullOnDelete();

            $table->decimal('total_amount', 10, 2)->comment('Total order price');
            $table->char('currency', 3)->default('USD')->comment('ISO currency code');
            $table->enum('status', ['pending', 'paid', 'shipped', 'completed', 'cancelled', 'refunded'])->default('PENDING')->comment('pending, paid, shipped, completed, cancelled, refunded');
            $table->enum('payment_status', ['APPROVED', 'PRE-AUTH', 'PENDING', 'DECLINED', 'REFUNDED', 'CANCELLED'])->default('PENDING')->comment('APPROVED, PRE-AUTH, PENDING, DECLINED, REFUNDED, CANCELLED');
            $table->string('payment_method', 50)->nullable()->comment('e.g., abapay_khqr, card');
            $table->string('tran_id', 100)->unique()->nullable()->comment('A unique transaction identifier for the payment.');
            $table->string('req_time', 14)->nullable()->comment('ABA request timestamp (YYYYMMDDHHmmss)');
            $table->text('shipping_address')->comment('Delivery info');
            $table->decimal('shipping_lat', 10, 7)->nullable()->comment('Shipping address latitude');
            $table->decimal('shipping_lng', 10, 7)->nullable()->comment('Shipping address longitude');
            $table->decimal('shipping_price', 10, 2)->default(0.00)->comment('Shipping fee for this order');
            $table->text('notes')->nullable()->comment('Buyer note');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
