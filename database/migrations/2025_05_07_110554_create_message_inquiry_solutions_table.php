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
        Schema::create('message_inquiry_solutions', function (Blueprint $table) {
            $table->id();

            $table->string('solution_name')->nullable();

            $table->unsignedBigInteger('message_id')->nullable();
            $table->foreign('message_id')
                ->references('id')
                ->on('message_inquiries')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');

            $table->unsignedBigInteger('solution_id')->nullable();
            $table->foreign('solution_id')
                ->references('id')
                ->on('pages')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('message_inquiry_solutions', function (Blueprint $table) {
            $table->dropForeign(['message_id']);
            $table->dropForeign(['solution_id']);
        });
        Schema::dropIfExists('message_inquiry_solutions');
    }
};
