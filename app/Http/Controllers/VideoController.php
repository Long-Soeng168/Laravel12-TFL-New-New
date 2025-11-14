<?php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Models\Video;
use App\Models\VideoPlayList;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class VideoController extends Controller implements HasMiddleware
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

        $query = Video::query()->with('playlist');

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('playlist_code', 'LIKE', "%{$search}%")
                    ->orWhere('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('playlist_code');
        $query->orderBy('order_index');
        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/videos/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $playlists = VideoPlayList::where('status', 'active')
            ->orderBy('id', 'desc')
            ->get();
        // dd($playlists);

        return Inertia::render('admin/videos/Create', [
            'playlists' => $playlists,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'is_free' => 'nullable|boolean',
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'video_file' => 'required|file|mimes:mp4|max:307200', // 300MB
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'playlist_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'total_view_counts' => 'nullable|integer|min:0',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        $video_file = $request->file('video_file');
        unset($validated['image']);
        unset($validated['video_file']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImage($image_file, 'assets/images/videos', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        if ($video_file) {
            try {
                $created_file_name  = FileHelper::uploadFile($video_file, 'assets/files/videos', true);
                $validated['video_file'] = $created_file_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload video: ' . $e->getMessage());
            }
        }

        Video::create($validated);

        return redirect()->back()->with('success', 'Video created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Video $video)
    {
        return Inertia::render('admin/videos/Show', [
            'video' => $video
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Video $video)
    {
        return Inertia::render('admin/videos/Create', [
            'editData' => $video,
            'playlists' => VideoPlayList::where('status', 'active')->orderBy('id', 'desc')->get(),
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Video $video)
    {
        $validated = $request->validate([
            'is_free' => 'nullable|boolean',
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'video_file' => 'nullable|file|mimes:mp4|max:307200',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'playlist_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'total_view_counts' => 'nullable|integer|min:0',
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
                $created_image_name = ImageHelper::uploadAndResizeImage($image_file, 'assets/images/videos', 600);
                $validated['image'] = $created_image_name;

                if ($video->image && $created_image_name) {
                    ImageHelper::deleteImage($video->image, 'assets/images/videos');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($video_file = $request->file('video_file')) {
            try {
                $created_file_name  = FileHelper::uploadFile($video_file, 'assets/files/videos', true);
                $validated['video_file'] = $created_file_name;

                if ($video->file_name && $created_file_name) {
                    FileHelper::deleteFile($video->file_name, 'assets/files/videos');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload video: ' . $e->getMessage());
            }
        }
        $video->update($validated);

        return redirect()->route('videos.index')->with('success', 'Video updated successfully!');
    }
    public function update_status(Request $request, Video $video)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $video->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }
    public function videos_free_status(Request $request, Video $video)
    {
        $request->validate([
            'status' => 'required|string|in:free,subscribe',
        ]);
        $video->update([
            'is_free' => $request->status == 'free',
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Video $video)
    {
        // Delete image if exists
        if ($video->image) {
            ImageHelper::deleteImage($video->image, 'assets/images/videos');
        }
        if ($video->file_name) {
            FileHelper::deleteFile($video->file_name, 'assets/files/videos');
        }
        $video->delete();

        return redirect()->route('videos.index')->with('success', 'Video deleted successfully!');
    }
}
