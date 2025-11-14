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

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('order_id')->comment('FK → orders.id');
            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->unsignedBigInteger('shop_id')->comment('FK → shops.id');
            $table->unsignedBigInteger('item_id')->comment('FK → products.id');

            $table->string('item_name', 500)->comment('Snapshot of product name at purchase');
            $table->decimal('price', 10, 2)->comment('Price at purchase time');
            $table->decimal('discount_percent', 5, 2)->default(0.00)->comment('Discount percentage for this item');
            $table->integer('quantity')->unsigned()->comment('Quantity ordered');
            $table->decimal('sub_total', 10, 2)->comment('price * quantity minus discount');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
