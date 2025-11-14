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
        Schema::create('queue_jobs', function (Blueprint $table) {
            $table->id();

            $table->string('job_type');               // e.g. payout, email
            $table->json('payload')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('status')->default('pending'); // pending, running, completed, failed
            $table->integer('delay_second')->default(0);  // when to run
            $table->timestamp('run_at')->nullable();  // when to run
            $table->timestamp('completed_at')->nullable();
            $table->text('note')->nullable();         // logs / errors
            $table->text('respone_log')->nullable();         // logs / errors

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queue_jobs');
    }
};
