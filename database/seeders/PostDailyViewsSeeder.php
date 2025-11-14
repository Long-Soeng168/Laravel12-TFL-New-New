<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PostDailyViewsSeeder extends Seeder
{
    public function run()
    {
        // Array of post IDs (either 2 or 4)
        $postIds = [2, 4];

        // Loop to insert 10 rows
        for ($i = 0; $i < 10; $i++) {
            DB::table('post_daily_views')->insert([
                'post_id' => $postIds[array_rand($postIds)], // Randomly pick either 2 or 4
                'view_date' => Carbon::now()->subDays(rand(1, 90))->toDateString(), // Random date within the last 90 days
                'view_counts' => rand(50, 500), // Random view counts between 50 and 500
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
