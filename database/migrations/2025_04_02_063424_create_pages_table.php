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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();

            $table->string('title')->index();
            $table->string('title_kh')->nullable();
            $table->string('short_description', length: 1000)->nullable();
            $table->string('short_description_kh', 1000)->nullable();
            $table->text('long_description')->nullable();
            $table->text('long_description_kh')->nullable();
            $table->string('link')->nullable();
            $table->string('type')->default('content')->nullable();
            $table->integer('order_index')->default(1)->nullable();
            $table->string('status')->default('active')->nullable();
            $table->unsignedBigInteger('total_view_counts')->default(0)->nullable();

            $table->unsignedBigInteger('parent_id')->nullable();
            
            $table->string('position_code')->nullable();
            $table->foreign('position_code')
                ->references('code')
                ->on('page_positions')
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

         // Step 2: Add foreign key constraint after table creation
         Schema::table('pages', function (Blueprint $table) {
            $table->foreign('parent_id')
                ->references('id')
                ->on('pages')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         // Drop foreign key before dropping the table
         Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['position_code']);
            $table->dropForeign(['parent_id']);
        });

        Schema::dropIfExists('pages');
    }
};
