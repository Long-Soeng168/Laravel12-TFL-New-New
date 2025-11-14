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
        Schema::create('banner_images', function (Blueprint $table) {
            $table->id();

            $table->string('image');
            $table->unsignedBigInteger('banner_id');
            $table->foreign('banner_id')
                ->references('id')
                ->on('banners')
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
        Schema::table('banner_images', function (Blueprint $table) {
            $table->dropForeign(['banner_id']);
        });

        Schema::dropIfExists('banner_images');
    }
};
