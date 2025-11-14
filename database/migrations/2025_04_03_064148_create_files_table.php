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
        Schema::create('files', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('path')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('extension')->nullable();
            $table->decimal('size')->nullable();
            $table->decimal('width')->nullable();
            $table->decimal('height')->nullable();

            $table->unsignedBigInteger('folder_id')->nullable();
            $table->foreign('folder_id')
                ->references('id')
                ->on('folders')
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
        // Drop foreign key before dropping the table
        Schema::table('files', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['folder_id']);
        });

        Schema::dropIfExists('files');
    }
};
