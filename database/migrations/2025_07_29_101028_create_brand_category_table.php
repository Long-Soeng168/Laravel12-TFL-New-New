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
        Schema::create('brand_category', function (Blueprint $table) {
            $table->id();

            $table->string('brand_code');
            $table->string('category_code');

            $table->timestamps();

            $table->unique(['brand_code', 'category_code']);

            $table->foreign('brand_code')->references('code')->on('item_brands')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('category_code')->references('code')->on('item_categories')->onUpdate('cascade')->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_category');
    }
};
