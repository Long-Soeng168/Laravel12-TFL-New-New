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
        Schema::create('garage_posts', function (Blueprint $table) {
            $table->id();

            $table->date('post_date')->nullable();
            $table->string('title')->index();
            $table->string('title_kh')->nullable();
            $table->string('short_description', 500)->nullable();
            $table->string('short_description_kh', 500)->nullable();
            $table->text('long_description')->nullable();
            $table->text('long_description_kh')->nullable();
            $table->string('link')->nullable();
            $table->string('type')->default('content')->nullable();
            $table->string('status')->default('active')->nullable();
            $table->unsignedBigInteger('total_view_counts')->default(0)->nullable();

            $table->unsignedBigInteger('garage_id')->nullable();
            $table->foreign('garage_id')
                ->references('id')
                ->on('garages')
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
        Schema::table('garage_posts', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });

        Schema::dropIfExists('garage_posts');
    }
};
