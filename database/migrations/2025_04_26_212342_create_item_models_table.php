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
        Schema::create('item_models', function (Blueprint $table) {
            $table->id();

            $table->string("code")->unique();
            $table->string("name");
            $table->string("name_kh")->nullable();
            $table->string("image")->nullable();
            $table->string("status")->nullable()->default('active');

            $table->string("brand_code")->nullable();
            $table->foreign('brand_code')
                ->references('code')
                ->on('item_brands')
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
        Schema::dropIfExists('item_models');
    }
};
