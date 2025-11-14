<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VideoPlaylist;
use App\Models\VideoPlaylistUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Image;

use Illuminate\Support\Facades\Notification;
use App\Notifications\MyTelegramBotNotification;

class VideoPlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        if ($search) {
            $videoPlaylists = VideoPlaylist::where('name', 'LIKE', "%$search%")
                ->with('teacher', 'category')->withCount('videos')
                ->paginate(10);
        } else {
            $videoPlaylists = VideoPlaylist::with('teacher', 'category')->withCount('videos')
                ->paginate(10);
        }
        return response()->json($videoPlaylists);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function playlistUser(Request $request)
    {
        $userId = $request->user()->id;
        $playlists = VideoPlaylistUser::where('user_id', $userId)
            ->where('status', 1)
            ->pluck('playlists_id')
            ->toArray();

        $result = array_map('intval', array_merge(...array_map(fn($item) => explode(',', $item), $playlists)));
        return response()->json($result);
    }

    public function storeOrderVideoPlaylist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'playlists_id' => 'required',
            'price' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        // return $request->all();

        try {
            // Store images if they are provided  
            $imageName;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = time() . '_' . $image->getClientOriginalName();
                $imagePath = public_path('assets/images/video_playlists_order_transactions/' . $fileName);
                $thumbPath = public_path('assets/images/video_playlists_order_transactions/thumb/' . $fileName);

                try {
                    // Create an image instance and save the original image
                    $uploadedImage = Image::make($image->getRealPath())->save($imagePath);

                    $uploadedImage->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                    })->save($thumbPath);

                    // Store the filename in the category
                    $imageName = $fileName;
                } catch (Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Fail to Save Image.',
                    ], 500);
                }
            }



            $videoPlaylistUserCreated = VideoPlaylistUser::create([
                'playlists_id' => $request->input('playlists_id'),
                'price' => $request->input('price'),
                'transaction_image' => $imageName,
                'user_id' => $request->user()->id,
            ]);


            try {
                Notification::route('telegram', config('services.telegram_chat_id'))
                    ->notify(new MyTelegramBotNotification($videoPlaylistUserCreated));
            } catch (\Exception $e) {
                // Log::error('Notification failed: ' . $e->getMessage());
            }


            return response()->json([
                'success' => true,
                'message' => 'Order successfully',
            ], 200);
        } catch (\Exception $e) {
            // Handle any error that occurs during the process
            return response()->json([
                'success' => false,
                'message' => 'Error creating Order: ' . $e->getMessage()
            ], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = VideoPlaylist::find($id);
        if (!$category) {
            return redirect()->back()->withErrors(['error' => 'Category not found']);
        }

        return response()->json($category);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
