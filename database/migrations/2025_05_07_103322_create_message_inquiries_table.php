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
        Schema::create('message_inquiries', function (Blueprint $table) {
            $table->id();

            $table->string('name')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('subject')->nullable();
            $table->string('other', 500)->nullable();
            $table->string('message', 500)->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_inquiries');
    }
};
