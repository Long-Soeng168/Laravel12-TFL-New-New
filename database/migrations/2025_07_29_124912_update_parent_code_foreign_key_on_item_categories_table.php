<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('item_categories', function (Blueprint $table) {
            // Drop the existing foreign key
            $table->dropForeign(['parent_code']);

            // Re-add it without onUpdate('CASCADE')
            // $table->foreign('parent_code')
            //     ->references('code')
            //     ->on('item_categories')
            //     ->onUpdate('CASCADE')
            //     ->onDelete('CASCADE');
        });
    }

    public function down(): void
    {
        Schema::table('item_categories', function (Blueprint $table) {
            // Rollback: Drop new FK and re-add the old one with onUpdate cascade
            $table->foreign('parent_code')
                ->references('code')
                ->on('item_categories')
                ->onUpdate('CASCADE')
                ->onDelete('CASCADE');
        });
    }
};
