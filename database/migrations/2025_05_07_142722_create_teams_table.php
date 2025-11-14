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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();

            $table->string('name')->index();
            $table->string('name_kh')->nullable();
            $table->string('image')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->string('short_description_kh', 500)->nullable();
            $table->text('long_description')->nullable();
            $table->text('long_description_kh')->nullable();
            $table->string('status')->default('active')->nullable();
            $table->integer('order_index')->default(1)->nullable();

            $table->string('category_code')->nullable();
            $table->foreign('category_code')
                ->references('code')
                ->on('team_categories')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');

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
        Schema::table('teams', function (Blueprint $table) {
            $table->dropForeign(['category_code']);
            $table->dropForeign(['position_code']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });

        Schema::dropIfExists('teams');
    }
};
