<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\ApplicationInfo;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ApplicationInfoController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:application_info view', only: ['index']),
            new Middleware('permission:application_info update', only: ['update', 'store']),
        ];
    }

    public function index()
    {
        return Inertia::render('admin/application_info/Index', [
            'editData' => ApplicationInfo::first(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:500',
            'name' => 'required|string|max:500',
            'address_kh' => 'nullable|string|max:500',
            'name_kh' => 'nullable|string|max:500',
            'phone' => 'nullable|string',
            'landline_phone' => 'nullable|string',
            'email' => 'nullable|string|max:255',
            'google_map' => 'nullable|string|max:500',
            'working_hours' => 'nullable|string|max:255',
            'working_hours_kh' => 'nullable|string|max:255',
            'working_days' => 'nullable|string|max:255',
            'working_days_kh' => 'nullable|string|max:255',
            'copyright' => 'nullable|string|max:255',
            'copyright_kh' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/application_info', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        ApplicationInfo::create($validated);

        return redirect()->back()->with('success', 'Info created successfully!');
    }
    public function update(Request $request, ApplicationInfo $application_info)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:500',
            'name' => 'required|string|max:500',
            'address_kh' => 'nullable|string|max:500',
            'name_kh' => 'nullable|string|max:500',
            'phone' => 'nullable|string',
            'landline_phone' => 'nullable|string',
            'google_map' => 'nullable|string|max:500',
            'email' => 'nullable|string|max:255',
            'working_hours' => 'nullable|string|max:255',
            'working_hours_kh' => 'nullable|string|max:255',
            'working_days' => 'nullable|string|max:255',
            'working_days_kh' => 'nullable|string|max:255',
            'copyright' => 'nullable|string|max:255',
            'copyright_kh' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/application_info', 600);
                $validated['image'] = $created_image_name;

                if ($application_info->image && $created_image_name) {
                    ImageHelper::deleteImage($application_info->image, 'assets/images/application_info');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $application_info->update($validated);

        return redirect()->back()->with('success', 'Info updated successfully!');
    }
}
