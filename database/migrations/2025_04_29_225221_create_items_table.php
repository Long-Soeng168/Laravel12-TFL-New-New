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
        Schema::create('items', function (Blueprint $table) {
            $table->id();

            $table->string('name')->index();
            $table->string('name_kh')->nullable();
            $table->string('code')->nullable();
            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->text('long_description')->nullable();
            $table->text('long_description_kh')->nullable();
            $table->string('link')->nullable();
            $table->decimal('cost')->nullable()->default(0);
            $table->decimal('price')->nullable()->default(0);
            $table->integer('quantity')->nullable()->default(0);
            $table->string('stock_status')->default('na')->nullable();
            $table->string('status')->default('active')->nullable();
            $table->decimal('discount')->nullable()->default(0);
            $table->string('discount_type')->nullable()->default('percentage');
            $table->dateTime('discount_start')->nullable();
            $table->dateTime('discount_end')->nullable();

            $table->unsignedBigInteger('total_view_counts')->default(0)->nullable();

            $table->string('category_code')->nullable();
            $table->foreign('category_code')
                ->references('code')
                ->on('item_categories')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->string('brand_code')->nullable();
            $table->foreign('brand_code')
                ->references('code')
                ->on('item_brands')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->string('model_code')->nullable();
            $table->foreign('model_code')
                ->references('code')
                ->on('item_models')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->string('body_type_code')->nullable();
            $table->foreign('body_type_code')
                ->references('code')
                ->on('item_body_types')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('updated_by')
                ->references('id')
                ->on('users')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->unsignedBigInteger('shop_id')->nullable();
            $table->foreign('shop_id')
                ->references('id')
                ->on('shops')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['category_code']);
            $table->dropForeign(['brand_code']);
            $table->dropForeign(['model_code']);
            $table->dropForeign(['body_type_code']);
            $table->dropForeign(['shop_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });
        Schema::dropIfExists('items');
    }
};
