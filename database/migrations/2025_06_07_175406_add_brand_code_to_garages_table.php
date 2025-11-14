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
        Schema::table('garages', function (Blueprint $table) {
            $table->string('brand_code')->nullable();
            $table->foreign('brand_code')
                ->references('code')
                ->on('item_brands')
                ->onUpdate('CASCADE')
                ->onDelete('SET NULL');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('garages', function (Blueprint $table) {
            $table->dropForeign(['brand_code']);
        });
        Schema::table('garages', function (Blueprint $table) {
            $table->dropColumn('brand_code');
        });
    }
};
