<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ProjectController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:project view', only: ['index', 'show', 'all_projects']),
            new Middleware('permission:project create', only: ['create', 'store']),
            new Middleware('permission:project update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:project delete', only: ['destroy', 'destroy_image']),
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

        $query = Project::query();

        $query->with('created_by', 'updated_by', 'images');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/projects/Index', [
            'tableData' => $tableData,
        ]);
    }

    public function all_projects()
    {
        return response()->json(Project::orderBy('id', 'desc')->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:projects,code',
            'order_index' => 'nullable|integer|min:0',
            'parent_code' => 'nullable|string',
            'status' => 'nullable|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        $created_project = Project::create($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/projects', 600);
                    ProjectImage::create([
                        'image' => $created_image_name,
                        'project_id' => $created_project->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Project created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:projects,code,' . $project->id,
            'order_index' => 'nullable|integer|min:0',
            'parent_code' => 'nullable|string',
            'status' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        $project->update($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/projects');
                    ProjectImage::create([
                        'image' => $created_image_name,
                        'project_id' => $project->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect('/admin/projects')->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Project updated successfully!');
    }

    public function update_status(Request $request, Project $project)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive,pending',
        ]);
        $project->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if (count($project->images) > 0) {
            foreach ($project->images as $image) {
                ImageHelper::deleteImage($image->image, 'assets/images/projects');
            }
        }
        $project->delete();
        return redirect()->back()->with('success', 'Project deleted successfully.');
    }

    public function destroy_image(ProjectImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/projects');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
