<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Heading
        Permission::firstOrCreate(['name' => 'heading view']);
        Permission::firstOrCreate(['name' => 'heading create']);
        Permission::firstOrCreate(['name' => 'heading update']);
        Permission::firstOrCreate(['name' => 'heading delete']);

        // Link
        Permission::firstOrCreate(['name' => 'link view']);
        Permission::firstOrCreate(['name' => 'link create']);
        Permission::firstOrCreate(['name' => 'link update']);
        Permission::firstOrCreate(['name' => 'link delete']);

        // Application Info
        Permission::firstOrCreate(['name' => 'application_info view']);
        Permission::firstOrCreate(['name' => 'application_info update']);

        // Post
        Permission::firstOrCreate(['name' => 'post view']);
        Permission::firstOrCreate(['name' => 'post create']);
        Permission::firstOrCreate(['name' => 'post update']);
        Permission::firstOrCreate(['name' => 'post delete']);

        // Page
        Permission::firstOrCreate(['name' => 'page view']);
        Permission::firstOrCreate(['name' => 'page create']);
        Permission::firstOrCreate(['name' => 'page update']);
        Permission::firstOrCreate(['name' => 'page delete']);

        // Banner (deduplicated)
        Permission::firstOrCreate(['name' => 'banner view']);
        Permission::firstOrCreate(['name' => 'banner create']);
        Permission::firstOrCreate(['name' => 'banner update']);
        Permission::firstOrCreate(['name' => 'banner delete']);

        // User
        Permission::firstOrCreate(['name' => 'user view']);
        Permission::firstOrCreate(['name' => 'user create']);
        Permission::firstOrCreate(['name' => 'user update']);
        Permission::firstOrCreate(['name' => 'user delete']);

        // role
        Permission::firstOrCreate(['name' => 'role view']);
        Permission::firstOrCreate(['name' => 'role create']);
        Permission::firstOrCreate(['name' => 'role update']);
        Permission::firstOrCreate(['name' => 'role delete']);

        // permission
        Permission::firstOrCreate(['name' => 'permission view']);
        Permission::firstOrCreate(['name' => 'permission create']);
        Permission::firstOrCreate(['name' => 'permission update']);
        Permission::firstOrCreate(['name' => 'permission delete']);

        // type
        Permission::firstOrCreate(['name' => 'type view']);
        Permission::firstOrCreate(['name' => 'type create']);
        Permission::firstOrCreate(['name' => 'type update']);
        Permission::firstOrCreate(['name' => 'type delete']);

        // File Manager
        Permission::firstOrCreate(['name' => 'file_manager view']);
        Permission::firstOrCreate(['name' => 'file_manager create']);
        Permission::firstOrCreate(['name' => 'file_manager delete']);

        // Item
        Permission::firstOrCreate(['name' => 'item view']);
        Permission::firstOrCreate(['name' => 'item create']);
        Permission::firstOrCreate(['name' => 'item update']);
        Permission::firstOrCreate(['name' => 'item delete']);
        // Shop
        Permission::firstOrCreate(['name' => 'shop view']);
        Permission::firstOrCreate(['name' => 'shop create']);
        Permission::firstOrCreate(['name' => 'shop update']);
        Permission::firstOrCreate(['name' => 'shop delete']);
        // Garage
        Permission::firstOrCreate(['name' => 'garage view']);
        Permission::firstOrCreate(['name' => 'garage create']);
        Permission::firstOrCreate(['name' => 'garage update']);
        Permission::firstOrCreate(['name' => 'garage delete']);
        // DTC
        Permission::firstOrCreate(['name' => 'dtc view']);
        Permission::firstOrCreate(['name' => 'dtc create']);
        Permission::firstOrCreate(['name' => 'dtc update']);
        Permission::firstOrCreate(['name' => 'dtc delete']);
        // Video
        Permission::firstOrCreate(['name' => 'video view']);
        Permission::firstOrCreate(['name' => 'video create']);
        Permission::firstOrCreate(['name' => 'video update']);
        Permission::firstOrCreate(['name' => 'video delete']);
        // Document
        Permission::firstOrCreate(['name' => 'document view']);
        Permission::firstOrCreate(['name' => 'document create']);
        Permission::firstOrCreate(['name' => 'document update']);
        Permission::firstOrCreate(['name' => 'document delete']);
        // Partner
        Permission::firstOrCreate(['name' => 'partner view']);
        Permission::firstOrCreate(['name' => 'partner create']);
        Permission::firstOrCreate(['name' => 'partner update']);
        Permission::firstOrCreate(['name' => 'partner delete']);
        // Course
        Permission::firstOrCreate(['name' => 'course view']);
        Permission::firstOrCreate(['name' => 'course create']);
        Permission::firstOrCreate(['name' => 'course update']);
        Permission::firstOrCreate(['name' => 'course delete']);
        // Phone_company
        Permission::firstOrCreate(['name' => 'phone_company view']);
        Permission::firstOrCreate(['name' => 'phone_company create']);
        Permission::firstOrCreate(['name' => 'phone_company update']);
        Permission::firstOrCreate(['name' => 'phone_company delete']);

        // Order
        Permission::firstOrCreate(['name' => 'order view']);
        Permission::firstOrCreate(['name' => 'order create']);
        Permission::firstOrCreate(['name' => 'order update']);
        Permission::firstOrCreate(['name' => 'order delete']);

        // Message
        Permission::firstOrCreate(['name' => 'message view']);
        Permission::firstOrCreate(['name' => 'message create']);
        Permission::firstOrCreate(['name' => 'message update']);
        Permission::firstOrCreate(['name' => 'message delete']);

        // Team
        Permission::firstOrCreate(['name' => 'team view']);
        Permission::firstOrCreate(['name' => 'team create']);
        Permission::firstOrCreate(['name' => 'team update']);
        Permission::firstOrCreate(['name' => 'team delete']);

        // Sample Content View
        Permission::firstOrCreate(['name' => 'sample_content view']);

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        // Give all existing permissions to the admin role
        $adminRole->syncPermissions(Permission::all());

        $editorRole = Role::firstOrCreate(['name' => 'Editor']);
        $userRole = Role::firstOrCreate(['name' => 'User']);
    }
}
