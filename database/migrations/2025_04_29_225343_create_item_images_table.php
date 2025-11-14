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
        Schema::create('item_images', function (Blueprint $table) {
            $table->id();

            $table->string('image');
            $table->unsignedBigInteger('item_id');
            $table->foreign('item_id')
                ->references('id')
                ->on('items')
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
        Schema::table('item_images', function (Blueprint $table) {
            $table->dropForeign(['item_id']);
        });

        Schema::dropIfExists('item_images');
    }
};
