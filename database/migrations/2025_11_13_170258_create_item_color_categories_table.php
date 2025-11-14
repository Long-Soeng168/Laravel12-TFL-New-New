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
        Schema::create('item_color_categories', function (Blueprint $table) {
            $table->id();

            $table->string('color_code');
            $table->string('category_code');

            $table->unique(['color_code', 'category_code']);

            $table->foreign('color_code')->references('code')->on('item_colors')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('category_code')->references('code')->on('item_categories')->onUpdate('cascade')->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_color_categories');
    }
};
