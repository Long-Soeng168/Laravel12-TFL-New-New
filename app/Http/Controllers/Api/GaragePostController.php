<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\GaragePost;
use App\Models\GaragePostImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Image;

class GaragePostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $garageId = $request->garageId;

        // Start building the query using query()
        $query = GaragePost::query();
        $query->with('images');

        // Apply search filter if search term is provided
        if ($search) {
            $query->where('title', 'LIKE', "%$search%");
        }

        // Apply garageId filter if provided
        if ($garageId) {
            $query->where('garage_id', $garageId);
        }

        // Paginate the results
        $garageposts = $query->orderBy('id', 'desc')->paginate(20);

        // Return the results as JSON
        return response()->json($garageposts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:4000',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:4048',
        ]);

        // return $request->all();

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        $userId = $request->user()->id;
        $garageId = $request->user()->garage_id;

        try {

            $created_post = GaragePost::create([
                'title' => $request->input('title'),
                'short_description' => $request->input('description'),
                'garage_id' => $garageId,
                'create_by_user_id' => $userId,
                "created_by" => $userId,
                "post_date" => $userId,
                "status" => 'active',
            ]);

            $image_files = $request->file('images');
            $image_file = $request->file('image');
            // Multi Image
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
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save image.',
                    ], 500);
                }
            }
            // Single Image
            if ($image_file) {
                try {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/garage_posts', 600);
                    GaragePostImage::create([
                        'image' => $created_image_name,
                        'post_id' => $created_post->id,
                    ]);
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save image.',
                    ], 500);
                }
            }


            return response()->json([
                'success' => true,
                'message' => 'Post created successfully',
                'post' => $created_post
            ], 200);
        } catch (\Exception $e) {
            // Handle any error during the process
            return response()->json([
                'success' => false,
                'message' => 'Error creating post: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate incoming request 
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:4000',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:4048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            // Find the post by ID
            $post = GaragePost::findOrFail($id);
            if ($post->garage_id != $request->user()->garage_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorize!'
                ], 401);
            }

            // Only authorized users can update the post
            if ($request->user()->garage_id !== $post->garage_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this post'
                ], 403);
            }

            // Update the image if provided
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $fileName = time() . '_' . $image->getClientOriginalName();
                $imagePath = public_path('assets/images/garageposts/' . $fileName);
                $thumbPath = public_path('assets/images/garageposts/thumb/' . $fileName);

                try {
                    // Create an image instance and save the original image
                    $uploadedImage = Image::make($image->getRealPath())->save($imagePath);

                    // Resize image to create a thumbnail
                    $uploadedImage->resize(500, null, function ($constraint) {
                        $constraint->aspectRatio();
                    })->save($thumbPath);

                    // Delete the old image files if they exist
                    if ($post->image) {
                        $oldImagePath = public_path('assets/images/garageposts/' . $post->image);
                        $oldThumbPath = public_path('assets/images/garageposts/thumb/' . $post->image);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                        if (file_exists($oldThumbPath)) {
                            unlink($oldThumbPath);
                        }
                    }

                    // Update the image filename in the post
                    $post->image = $fileName;
                } catch (Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to save image.',
                    ], 500);
                }
            }

            // Update the description
            $post->description = $request->input('description');
            $post->save();

            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully',
                'post' => $post
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found'
            ], 404);
        } catch (\Exception $e) {
            // Handle any error during the process
            return response()->json([
                'success' => false,
                'message' => 'Error updating post: ' . $e->getMessage()
            ], 500);
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $garagepost = GaragePost::findOrFail($id);
        return response()->json($garagepost);
    }

    public function getPostsByGarage($id)
    {
        $garageposts = GaragePost::where("garage_id", $id)->paginate(10);
        return response()->json($garageposts);
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
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find the post by ID
        $post = GaragePost::find($id);

        // Check if post exists
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found',
            ], 404);
        }

        try {
            // Optionally delete the image if it exists
            if ($post->image) {
                $imagePath = public_path('assets/images/garageposts/' . $post->image);
                $thumbPath = public_path('assets/images/garageposts/thumb/' . $post->image);

                // Delete image and thumbnail from server
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
                if (file_exists($thumbPath)) {
                    unlink($thumbPath);
                }
            }

            // Delete the post
            $post->delete();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            // Handle any error during the process
            return response()->json([
                'success' => false,
                'message' => 'Error deleting post: ' . $e->getMessage(),
            ], 500);
        }
    }
}
