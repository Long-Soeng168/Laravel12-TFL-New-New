<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\VideoPlayList;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class VideoPlayListController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:video view', only: ['index', 'show']),
            new Middleware('permission:video create', only: ['create', 'store']),
            new Middleware('permission:video update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:video delete', only: ['destroy', 'destroy_image']),
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

        $query = VideoPlayList::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/video_play_lists/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/video_play_lists/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:video_play_lists,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'nullable|string|in:active,inactive',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImage($image_file, 'assets/images/video_play_lists', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        VideoPlayList::create($validated);

        return redirect()->route('video_play_lists.index')->with('success', 'Video play list created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(VideoPlayList $video_play_list)
    {
        return Inertia::render('admin/video_play_lists/Show', [
            'videoPlayList' => $video_play_list
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VideoPlayList $video_play_list)
    {
        return Inertia::render('admin/video_play_lists/Edit', [
            'videoPlayList' => $video_play_list
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VideoPlayList $video_play_list)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:video_play_lists,code,' . $video_play_list->id,
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'nullable|string|in:active,inactive',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
        ]);
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImage($image_file, 'assets/images/video_play_lists', 600);
                $validated['image'] = $created_image_name;

                if ($video_play_list->image && $created_image_name) {
                    ImageHelper::deleteImage($video_play_list->image, 'assets/images/video_play_lists');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $video_play_list->update($validated);

        return redirect()->route('video_play_lists.index')->with('success', 'Video play list updated successfully!');
    }
    public function update_status(Request $request, VideoPlayList $video_play_list)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $video_play_list->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VideoPlayList $video_play_list)
    {
        // Delete image if exists
        if ($video_play_list->image) {
            ImageHelper::deleteImage($video_play_list->image, 'assets/images/video_play_lists');
        }
        $video_play_list->delete();

        return redirect()->route('video_play_lists.index')->with('success', 'Video play list deleted successfully!');
    }
}
