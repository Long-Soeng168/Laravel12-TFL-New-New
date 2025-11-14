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
        Schema::create('garages', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('location', 500)->nullable();
            $table->string('status')->nullable()->default('active');
            $table->string('short_description', 500)->nullable();
            $table->string('short_description_kh', 500)->nullable();
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->integer('order_index')->nullable()->default(100);

            $table->unsignedBigInteger('owner_user_id')->nullable();
            $table->foreign('owner_user_id')
                ->references('id')
                ->on('users')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');

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
        Schema::table('garages', function (Blueprint $table) {
            $table->dropForeign(['owner_user_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });

        Schema::dropIfExists('garages');
    }
};
