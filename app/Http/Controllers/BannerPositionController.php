<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\BannerPosition;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class BannerPositionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:banner view', only: ['index', 'show']),
            new Middleware('permission:banner create', only: ['create', 'store']),
            new Middleware('permission:banner update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:banner delete', only: ['destroy', 'destroy_image', 'remove_banner_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = BannerPosition::query();

        $query->with('created_by', 'updated_by');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/banner_positions/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:banner_positions,code',
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        $banner_file = $request->file('banner');
        unset($validated['image']);
        unset($validated['banner']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}


        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/banner_positions', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/banner_positions', 900);
                $validated['banner'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        BannerPosition::create($validated);

        return redirect()->back()->with('success', 'Page position created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BannerPosition $bannerPosition)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:banner_positions,code,' . $bannerPosition->id,
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        $banner_file = $request->file('banner');
        unset($validated['image']);
        unset($validated['banner']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/banner_positions', 600);
                $validated['image'] = $created_image_name;

                if ($bannerPosition->image && $created_image_name) {
                    ImageHelper::deleteImage($bannerPosition->image, 'assets/images/banner_positions');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/banner_positions', 900);
                $validated['banner'] = $created_image_name;

                if ($bannerPosition->banner && $created_image_name) {
                    ImageHelper::deleteImage($bannerPosition->banner, 'assets/images/banner_positions');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $bannerPosition->update($validated);


        return redirect()->back()->with('success', 'Position updated successfully!');
    }

    public function update_status(Request $request, BannerPosition $bannerPosition)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $bannerPosition->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BannerPosition $bannerPosition)
    {
        if ($bannerPosition->image) {
            ImageHelper::deleteImage($bannerPosition->image, 'assets/images/banner_positions');
        }
        if ($bannerPosition->banner) {
            ImageHelper::deleteImage($bannerPosition->banner, 'assets/images/banner_positions');
        }
        $bannerPosition->delete();
        return redirect()->back()->with('success', 'Position deleted successfully.');
    }
}
