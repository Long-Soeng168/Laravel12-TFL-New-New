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
        Schema::create('item_with_sizes', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('item_id');
            $table->string('size_code'); // hex or named color

            // FK
            $table->foreign('size_code')
                ->references('code')
                ->on('item_sizes')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('item_id')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_with_sizes');
    }
};
