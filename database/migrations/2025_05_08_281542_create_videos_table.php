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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_free')->nullable()->default(false);
            $table->string('title');
            $table->string('title_kh')->nullable();
            $table->string('video_file')->nullable();
            $table->string('image')->nullable();
            $table->string('status')->nullable()->default('active');
            $table->unsignedInteger('order_index')->default('1');
            $table->text('short_description')->nullable();
            $table->text('short_description_kh')->nullable();
            $table->bigInteger('total_view_counts')->nullable();

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

            $table->string('playlist_code')->nullable();
            $table->foreign('playlist_code')
                ->references('code')
                ->on('video_play_lists')
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
        Schema::table('videos', function (Blueprint $table) {
            $table->dropForeign(['playlist_code']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
        });
        Schema::dropIfExists('videos');
    }
};
