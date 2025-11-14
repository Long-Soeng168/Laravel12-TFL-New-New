<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('application_infos', function (Blueprint $table) {
            $table->id();

            $table->string('address', 500)->nullable();
            $table->string('address_kh', 500)->nullable();
            $table->string('name');
            $table->string('name_kh')->nullable();
            $table->string('phone')->nullable();
            $table->string('working_hours')->nullable();
            $table->string('working_hours_kh')->nullable();
            $table->string('working_days')->nullable();
            $table->string('working_days_kh')->nullable();
            $table->string('email')->nullable();
            $table->string('image')->nullable();
            $table->string('copyright')->nullable();
            $table->string('copyright_kh')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_infos');
    }
};
