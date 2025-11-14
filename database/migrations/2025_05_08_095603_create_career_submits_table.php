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
        Schema::create('career_submits', function (Blueprint $table) {
            $table->id();

            $table->string('name')->index();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('cv_file')->nullable();
            $table->string('status')->default('active')->nullable();

            $table->string('position_code')->nullable();
            $table->foreign('position_code')
                ->references('code')
                ->on('positions')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->unsignedBigInteger('career_id')->nullable();
            $table->foreign('career_id')
                ->references('id')
                ->on('careers')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('career_submits');
    }
};
