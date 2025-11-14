<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Garage;
use App\Models\Link;
use App\Models\GaragePost;
use App\Models\PostCategory;
use App\Models\GaragePostImage;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;


class GaragePostController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:garage view', only: ['index', 'show']),
            new Middleware('permission:garage create', only: ['create', 'store']),
            new Middleware('permission:garage update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:garage delete', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = GaragePost::query();

        $query->with('created_by', 'updated_by', 'images', 'garage');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/garage_posts/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('admin/garage_posts/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'postCategories' => PostCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'allGarages' => Garage::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'post'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'post_date' => 'required|date',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            // 'long_description' => 'nullable|string',
            // 'long_description_kh' => 'nullable|string',
            // 'link' => 'nullable|string|max:255',
            // 'source' => 'nullable|string|max:255',
            'garage_id' => 'required|exists:garages,id',
            'type' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $validated['post_date'] = Carbon::parse($validated['post_date'])->setTimezone('Asia/Bangkok')->startOfDay()->toDateString();


        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        $created_post = GaragePost::create($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/garage_posts', 600);
                    GaragePostImage::create([
                        'image' => $created_image_name,
                        'post_id' => $created_post->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        return redirect()->back()->with('success', 'Post Created Successfully!.');
    }

    /**
     * Display the specified resource.
     */
    public function show(GaragePost $garage_post)
    {
        return Inertia::render('admin/garage_posts/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $garage_post->load('images'),
            'allGarages' => Garage::where('status', 'active')->orderBy('id', 'desc')->get(),
            'postCategories' => PostCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'post'])->orderBy('id', 'desc')->get(),
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(GaragePost $garage_post)
    {
        return Inertia::render('admin/garage_posts/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $garage_post->load('images'),
            'allGarages' => Garage::where('status', 'active')->orderBy('id', 'desc')->get(),
            'postCategories' => PostCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'post'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GaragePost $garage_post)
    {
        // dd($request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'post_date' => 'nullable',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            // 'long_description' => 'nullable|string',
            // 'long_description_kh' => 'nullable|string',
            // 'link' => 'nullable|string|max:255',
            // 'source' => 'nullable|string|max:255',
            'garage_id' => 'required|exists:garages,id',
            'type' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;
        $validated['post_date'] = Carbon::parse($validated['post_date'])->setTimezone('Asia/Bangkok')->startOfDay()->toDateString();
        // $validated['post_date'] = Carbon::parse($validated['post_date'])->addDay()->toDateString();

        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        $garage_post->update($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/garage_posts', 600);
                    GaragePostImage::create([
                        'image' => $created_image_name,
                        'post_id' => $garage_post->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        return redirect()->back()->with('success', 'Post Updated Successfully!.');
    }

    public function update_status(Request $request, GaragePost $garage_post)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $garage_post->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GaragePost $garage_post)
    {
        if (count($garage_post->images) > 0) {
            foreach ($garage_post->images as $image) {
                ImageHelper::deleteImage($image->image, 'assets/images/garage_posts');
            }
        }
        $garage_post->delete();
        return redirect()->back()->with('success', 'post deleted successfully.');
    }

    public function destroy_image(GaragePostImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/garage_posts');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
