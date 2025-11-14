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
        Schema::create('item_size_categories', function (Blueprint $table) {
            $table->id();

            $table->string('size_code');
            $table->string('category_code');

            $table->unique(['size_code', 'category_code']);

            $table->foreign('size_code')->references('code')->on('item_sizes')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('category_code')->references('code')->on('item_categories')->onUpdate('cascade')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_size_categories');
    }
};
