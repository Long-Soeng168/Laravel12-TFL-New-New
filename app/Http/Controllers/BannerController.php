<?php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Models\Banner;
use App\Models\BannerImage;
use App\Models\BannerPosition;
use App\Models\Link;
use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class BannerController extends Controller implements HasMiddleware
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

        $query = Banner::query();

        $query->with('created_by', 'updated_by', 'images', 'position', 'source_detail');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                ;
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/banners/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        $query = Banner::query();

        $parentData = $query->get();
        return Inertia::render('admin/banners/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'bannerPositions' => BannerPosition::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'banner'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer|min:0',
            'parent_id' => 'nullable|numeric',
            'position_code' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'video' => 'nullable|file|mimes:mp4',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $video_file = $request->file('video');
        unset($validated['video']);

        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($video_file) {
            try {
                $created_file_name = FileHelper::uploadFile($video_file, 'assets/files/banners/videos', true);
                if ($created_file_name) {
                    $validated['video'] = $created_file_name;
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload video: ' . $e->getMessage());
            }
        }

        $created_banner = Banner::create($validated);

        if ($image_files && $validated['type'] == 'multi_images') {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/banners', 1920);
                    BannerImage::create([
                        'image' => $created_image_name,
                        'banner_id' => $created_banner->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        } // For single image
        elseif ($image_files && !empty($image_files)) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_files[0], 'assets/images/banners', 1920);
                $created_banner->update([
                    'image' => $created_image_name,
                ]);
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Banner Created Successfully!.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        $query = Banner::query();

        $parentData = $query->where('id', '!=', $banner->id)->get();
        return Inertia::render('admin/banners/Create', [
            'editData' => $banner->load('images'),
            'parentData' => $parentData,
            'bannerPositions' => BannerPosition::all(),
            'readOnly' => true,
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Banner $banner)
    {

        $query = Banner::query();

        $parentData = $query->where('id', '!=', $banner->id)->get();
        return Inertia::render('admin/banners/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $banner->load('images'),
            'parentData' => $parentData,
            'bannerPositions' => BannerPosition::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'banner'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer|min:0',
            'parent_id' => 'nullable|numeric',
            'position_code' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'video' => 'nullable|file|mimes:mp4',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        $video_file = $request->file('video');
        unset($validated['video']);

        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($video_file) {
            try {
                $created_file_name = FileHelper::uploadFile($video_file, 'assets/files/banners/videos', true);
                if ($created_file_name && $banner->video) {
                    FileHelper::deleteFile($banner->video, 'assets/files/banners/videos');
                }
                if ($created_file_name) {
                    $validated['video'] = $created_file_name;
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload video: ' . $e->getMessage());
            }
        }

        $banner->update($validated);

        if ($image_files && $validated['type'] == 'multi_images') {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/banners', 1920);
                    BannerImage::create([
                        'image' => $created_image_name,
                        'banner_id' => $banner->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        } // For single image
        elseif ($image_files && !empty($image_files)) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_files[0], 'assets/images/banners', 1920);
                if ($created_image_name && $banner->image) {
                    ImageHelper::deleteImage($banner->image, 'assets/images/banners');
                }
                $banner->update([
                    'image' => $created_image_name,
                ]);
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Banner Updated Successfully!.');
    }

    public function update_status(Request $request, Banner $banner)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $banner->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        if (count($banner->images) > 0) {
            foreach ($banner->images as $image) {
                ImageHelper::deleteImage($image->image, 'assets/images/banners');
            }
        }
        if ($banner->image) {
            ImageHelper::deleteImage($banner->image, 'assets/images/banners');
        }
        if ($banner->video) {
            FileHelper::deleteFile($banner->video, 'assets/files/banners/videos');
        }

        $banner->delete();
        return redirect()->back()->with('success', 'Banner deleted successfully.');
    }
    public function remove_banner_image(Banner $banner)
    {
        if ($banner->image) {
            ImageHelper::deleteImage($banner->image, 'assets/images/banners');
        }

        $banner->update([
            'image' => null,
        ]);
        return redirect()->back()->with('success', 'Banner image remove successfully.');
    }

    public function destroy_image(BannerImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/banners');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
