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
        Schema::create('item_daily_views', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('item_id');
            $table->date('view_date');
            $table->unsignedBigInteger('view_counts')->default(0);

            // Constraints
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
            $table->unique(['item_id', 'view_date']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_daily_views');
    }
};
