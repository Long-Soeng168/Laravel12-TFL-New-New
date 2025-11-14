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
        Schema::create('garage_post_daily_views', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('post_id');
            $table->date('view_date');
            $table->unsignedBigInteger('view_counts')->default(0);

             // Constraints
             $table->foreign('post_id')->references('id')->on('garage_posts')->onDelete('cascade');
             $table->unique(['post_id', 'view_date']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garage_post_daily_views');
    }
};
