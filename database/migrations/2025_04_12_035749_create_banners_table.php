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
        Schema::create('banners', function (Blueprint $table) {
            $table->id();

            $table->string('title')->index();
            $table->string('title_kh')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->string('short_description_kh', 500)->nullable();
            $table->string('link')->nullable();
            $table->string('image')->nullable();
            $table->string('video')->nullable();
            $table->string('type')->default('image')->nullable();
            $table->integer('order_index')->default(1)->nullable();
            $table->string('status')->default('active')->nullable();

            $table->string('position_code')->nullable();
            $table->foreign('position_code')
                ->references('code')
                ->on('banner_positions')
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
        // Drop foreign key before dropping the table
        Schema::table('banners', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['position_code']);
        });

        Schema::dropIfExists('banners');
    }
};
