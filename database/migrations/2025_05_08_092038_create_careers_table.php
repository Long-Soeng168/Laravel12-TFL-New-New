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
        Schema::create('careers', function (Blueprint $table) {
            $table->id();

            $table->string('name')->index();
            $table->string('name_kh')->nullable();
            $table->string('short_description', 1000)->nullable();
            $table->string('short_description_kh', 1000)->nullable();
            $table->string('image')->nullable();
            $table->string('cv_file')->nullable();
            $table->string('status')->default('active')->nullable();

            $table->string('location', 500)->nullable();
            $table->string('industry', 500)->nullable();
            $table->decimal('budget')->nullable()->default(0);

            $table->text('qualification')->nullable();
            $table->text('skill')->nullable();
            $table->text('responsibility')->nullable();

            $table->string('position_code')->nullable();
            $table->foreign('position_code')
                ->references('code')
                ->on('positions')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->unsignedBigInteger('created_by')->nullable();
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('updated_by')
                ->references('id')
                ->on('users')
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
        Schema::table('careers', function (Blueprint $table) {
            $table->dropForeign(['position_code']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });

        Schema::dropIfExists('careers');
    }
};
