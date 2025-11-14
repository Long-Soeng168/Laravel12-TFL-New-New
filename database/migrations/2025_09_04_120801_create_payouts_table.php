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
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');

            $table->decimal('total_amount', 10, 2);   // full order total
            $table->decimal('shipping_receive_amount', 10, 2)->default(0);
            $table->string('shipping_bank_account');
            $table->string('shop_bank_account');
            $table->decimal('commission', 10, 2);
            $table->decimal('shop_receive_amount', 10, 2);
            $table->decimal('website_receive_amount', 10, 2);

            $table->string('req_time', 14)->nullable()->comment('Payout request timestamp (YYYYMMDDHHmmss)');

            $table->enum('payout_status', ['unpaid', 'in_progress', 'paid', 'failed'])
                ->default('unpaid');

            // Recommended extra fields
            $table->string('tran_id', 100)->unique()->comment('A unique transaction identifier for the payout.');
            $table->string('trace_id', 100)->unique()->comment('A unique trace_id for the payout.');
            $table->string('payout_ref')->nullable();      // PayWay payout reference ID
            $table->text('response_data')->nullable();     // store API response/debugging

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
};
