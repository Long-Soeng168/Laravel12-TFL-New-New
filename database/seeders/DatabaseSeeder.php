<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Dtc;
use App\Models\Folder;
use App\Models\ItemBrand;
use App\Models\Partner;
use App\Models\PhoneCompany;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // User::factory()->create([
        //     'name' => 'Admin',
        //     'email' => 'admin@gmail.com',
        //     'password' => Hash::make('12345678'),
        // ]);

        // Folder::factory()->createMany([
        //     ['name' => 'Images'],
        //     ['name' => 'Files'],
        // ]);

        // \App\Models\Project::factory(30)->create();
        //partner seeder
        // Partner::factory(30)->create();
        // ItemBrand::factory(30)->create();
        // PhoneCompany::factory(30)->create();
        // Dtc::factory(30)->create();
        // Course::factory(30)->create();
        \App\Models\VideoPlayList::factory(5)->create();
        // \App\Models\Video::factory(30)->create();
    }
}
