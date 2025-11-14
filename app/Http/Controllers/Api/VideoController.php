<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\VideoPlayList;
use App\Models\VideoPlaylistUser;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Retrieve request parameters with defaults
        $search = $request->input('search', '');
        $playlistId = $request->input('playlistId');
        $sortBy = $request->input('sortBy', 'title'); // Default sort by 'title'
        $sortOrder = $request->input('sortOrder', 'asc'); // Default order 'asc'
        $perPage = $request->input('perPage', 50); // Default 50 items per page

        // Start building the query
        $query = Video::query();

        // Apply search filter
        if (!empty($search)) {
            $query->where('title', 'LIKE', "%{$search}%");
        }

        // Apply playlist filter
        if (!empty($playlistId)) {
            $playlist = VideoPlayList::find($playlistId);
            if ($playlist) {
                $query->where('playlist_code', $playlist->code);
            } else {
                // If playlist not found, optionally return empty result
                return response()->json([
                    'data' => [],
                    'message' => 'Playlist not found.'
                ], 404);
            }
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);
        $query->where('status', 'active');

        // Paginate the results
        $videos = $query->paginate($perPage);

        // Transform collection to old key format
        $videos->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->image,
                'description' => $item->short_description, // or $item->short_description_kh
                'video_name' => $item->video_file,
                'playlist_id' => optional(VideoPlayList::where('code', $item->playlist_code)->first())->id,
                'status' => $item->status,
                'views_count' => $item->total_view_counts,
                'is_free' => $item->is_free,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        // Return JSON response with transformed data
        return response()->json($videos);
    }

    /**
     * Display the specified resource.
     */
    public function show(Video $video)
    {
        // Increment views_count
        $video->increment('total_view_counts');

        // Return video in old key format
        $playlistId = optional(VideoPlayList::where('code', $video->playlist_code)->first())->id;

        $formattedVideo = [
            'id' => $video->id,
            'title' => $video->title,
            'image' => $video->image,
            'description' => $video->short_description, // or $video->short_description_kh
            'video_name' => $video->video_file,
            'playlist_id' => $playlistId,
            'status' => $video->status,
            'views_count' => $video->total_view_counts,
            'is_free' => $video->is_free,
            'created_at' => $video->created_at,
            'updated_at' => $video->updated_at,
        ];

        return response()->json($formattedVideo);
    }


    public function video_playlists(Request $request)
    {
        $search = $request->search;

        $videoPlaylists = VideoPlayList::when($search, function ($query) use ($search) {
            $query->where('name', 'LIKE', "%$search%");
        })
            ->withCount('videos')
            ->paginate(10);

        // Replace items with mapped data
        $videoPlaylists->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'image' => $item->image,
                'description' => $item->short_description,
                'category_id' => null,
                'teacher_id' => null,
                'price' => $item->price,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'videos_count' => $item->videos_count,
            ];
        });

        // Return the full paginator with mapped items
        return response()->json($videoPlaylists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function playlistUser(Request $request)
    {
        // $userId = $request->user()->id;
        // $playlists = VideoPlaylistUser::where('user_id', $userId)
        //     ->where('status', 1)
        //     ->pluck('playlists_id')
        //     ->toArray();

        // $result = array_map('intval', array_merge(...array_map(fn($item) => explode(',', $item), $playlists)));
        // return response()->json($result);
    }
}
