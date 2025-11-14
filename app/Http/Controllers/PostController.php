<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Link;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PostImage;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;


class PostController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:post view', only: ['index', 'show']),
            new Middleware('permission:post create', only: ['create', 'store']),
            new Middleware('permission:post update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:post delete', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Post::query();

        $query->with('created_by', 'updated_by', 'images', 'category', 'source_detail');

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

        return Inertia::render('admin/posts/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('admin/posts/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'postCategories' => PostCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'post'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'post_date' => 'required|date',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'category_code' => 'nullable|string',
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

        $created_project = Post::create($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/posts', 600);
                    PostImage::create([
                        'image' => $created_image_name,
                        'post_id' => $created_project->id,
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
    public function show(Post $post)
    {
        return Inertia::render('admin/posts/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $post->load('images'),
            'postCategories' => PostCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'post'])->orderBy('id', 'desc')->get(),
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $post->load('images'),
            'postCategories' => PostCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'post'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        // dd($request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'post_date' => 'nullable',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'category_code' => 'nullable|string',
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

        $post->update($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/posts', 600);
                    PostImage::create([
                        'image' => $created_image_name,
                        'post_id' => $post->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        return redirect()->back()->with('success', 'Post Updated Successfully!.');
    }

    public function update_status(Request $request, Post $post)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $post->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        if (count($post->images) > 0) {
            foreach ($post->images as $image) {
                ImageHelper::deleteImage($image->image, 'assets/images/posts');
            }
        }
        $post->delete();
        return redirect()->back()->with('success', 'post deleted successfully.');
    }

    public function destroy_image(PostImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/posts');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
