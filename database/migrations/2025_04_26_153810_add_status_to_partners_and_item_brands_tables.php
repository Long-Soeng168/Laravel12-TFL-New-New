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
        // Add status field to partners table
        Schema::table('partners', function (Blueprint $table) {
            $table->string('status')->nullable()->default('active'); // Adjust based on your needs (nullable or not)
        });

        // Add status field to item_brands table
        Schema::table('item_brands', function (Blueprint $table) {
            $table->string('status')->nullable()->default('active'); // Adjust based on your needs (nullable or not)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove status field from partners table
        Schema::table('partners', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        // Remove status field from item_brands table
        Schema::table('item_brands', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
