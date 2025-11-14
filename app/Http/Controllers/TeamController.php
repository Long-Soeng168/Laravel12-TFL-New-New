<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Team;
use App\Models\TeamCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class TeamController extends Controller implements HasMiddleware
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

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Team::query();

        $query->with('created_by', 'updated_by', 'category');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/teams/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('admin/teams/Create', [
            'teamCategories' => TeamCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
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
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'category_code' => 'nullable|string',
            'position_code' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/teams', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $created_project = Team::create($validated);

        return redirect()->back()->with('success', 'Team Created Successfully!.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        return Inertia::render('admin/teams/Create', [
            'editData' => $team,
            'teamCategories' => TeamCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Team $team)
    {
        return Inertia::render('admin/teams/Create', [
            'editData' => $team,
            'teamCategories' => TeamCategory::where('status', 'active')->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'category_code' => 'nullable|string',
            'position_code' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/teams', 600);
                $validated['image'] = $created_image_name;
                if (!empty($created_image_name)) {
                    ImageHelper::deleteImage($team->image, 'assets/images/teams');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $team->update($validated);

        return redirect()->back()->with('success', 'Team Updated Successfully!.');
    }

    public function update_status(Request $request, Team $team)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $team->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        if (!empty($team->image)) {
            ImageHelper::deleteImage($team->image, 'assets/images/teams');
        }
        $team->delete();
        return redirect()->back()->with('success', 'Team deleted successfully.');
    }
}
