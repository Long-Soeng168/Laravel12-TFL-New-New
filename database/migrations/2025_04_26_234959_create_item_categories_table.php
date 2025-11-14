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
        Schema::create('item_categories', function (Blueprint $table) {
            $table->id();


            $table->string('name');
            $table->string('name_kh')->nullable();
            $table->string('code')->unique();
            $table->string('status')->nullable()->default('active');
            $table->string('short_description', 500)->nullable();
            $table->string('short_description_kh', 500)->nullable();
            $table->string('image')->nullable();
            $table->string('banner')->nullable();
            $table->integer('order_index')->nullable()->default(1);

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

            $table->timestamps();
        });

        Schema::table('item_categories', function (Blueprint $table) {
            $table->string('parent_code')->nullable();
            $table->foreign('parent_code')
                ->references('code')
                ->on('item_categories')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('item_categories', function (Blueprint $table) {
            $table->dropForeign(['parent_code']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });

        Schema::dropIfExists('item_categories');
    }
};
