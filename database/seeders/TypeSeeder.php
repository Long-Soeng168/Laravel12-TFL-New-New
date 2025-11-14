<?php

namespace Database\Seeders;

use App\Models\Type;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Post Types
        Type::firstOrCreate([
            'type' => 'content',
            'label' => 'Content',
            'type_of' => 'post',
        ]);
        Type::firstOrCreate([
            'type' => 'link',
            'label' => 'Link',
            'type_of' => 'post',
        ]);

        // Page Types
        Type::firstOrCreate([
            'type' => 'content',
            'label' => 'Content',
            'type_of' => 'page',
        ]);
        Type::firstOrCreate([
            'type' => 'link',
            'label' => 'Link',
            'type_of' => 'page',
        ]);

        // Banner Types
        Type::firstOrCreate([
            'type' => 'image',
            'label' => 'Image (Single Image)',
            'type_of' => 'banner',
        ]);
        Type::firstOrCreate([
            'type' => 'multi_images',
            'label' => 'Multiple Images',
            'type_of' => 'banner',
        ]);
        Type::firstOrCreate([
            'type' => 'video',
            'label' => 'Video',
            'type_of' => 'banner',
        ]);
        Type::firstOrCreate([
            'type' => 'embed',
            'label' => 'Embed',
            'type_of' => 'banner',
        ]);

        // Link Types
        Type::firstOrCreate([
            'type' => 'social_media',
            'label' => 'Social Media',
            'type_of' => 'link',
        ]);
        Type::firstOrCreate([
            'type' => 'contact',
            'label' => 'Contact',
            'type_of' => 'link',
        ]);
    }
}
