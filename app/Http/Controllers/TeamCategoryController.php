<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\TeamCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class TeamCategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:team view', only: ['index', 'show']),
            new Middleware('permission:team create', only: ['create', 'store']),
            new Middleware('permission:team update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:team delete', only: ['destroy', 'destroy_image']),
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

        $query = TeamCategory::query();

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

        return Inertia::render('admin/team_categories/Index', [
            'tableData' => $tableData,
        ]);
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:team_categories,code',
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/team_categories', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/team_categories', 900);
                $validated['banner'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        TeamCategory::create($validated);

        return redirect()->back()->with('success', 'Post category created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TeamCategory $team_category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'code'  => 'required|string|max:255|unique:team_categories,code,' . $team_category->id,
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/team_categories', 600);
                $validated['image'] = $created_image_name;

                if ($team_category->image && $created_image_name) {
                    ImageHelper::deleteImage($team_category->image, 'assets/images/team_categories');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/team_categories', 900);
                $validated['banner'] = $created_image_name;

                if ($team_category->banner && $created_image_name) {
                    ImageHelper::deleteImage($team_category->banner, 'assets/images/team_categories');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $team_category->update($validated);


        return redirect()->back()->with('success', 'Category updated successfully!');
    }


    public function update_status(Request $request, TeamCategory $team_category)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $team_category->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeamCategory $team_category)
    {
        if ($team_category->image) {
            ImageHelper::deleteImage($team_category->image, 'assets/images/team_categories');
        }
        if ($team_category->banner) {
            ImageHelper::deleteImage($team_category->banner, 'assets/images/team_categories');
        }
        $team_category->delete();
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
