<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CourseController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:course view', only: ['index', 'show']),
            new Middleware('permission:course create', only: ['create', 'store']),
            new Middleware('permission:course update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:course delete', only: ['destroy', 'destroy_image']),
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

        $query = Course::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                    ->orWhere('price', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/courses/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/courses/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:courses,title',
            'title_kh' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price' => 'required|numeric|min:0',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/courses', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        Course::create($validated);

        return redirect()->route('courses.index')->with('success', 'Course created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        return Inertia::render('admin/courses/Show', [
            'course' => $course
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        return Inertia::render('admin/courses/Edit', [
            'course' => $course
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:courses,title,' . $course->id,
            'title_kh' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'price' => 'required|numeric|min:0',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'start_at' => 'nullable|date',
            'end_at' => 'nullable|date|after_or_equal:start_at',

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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/courses', 600);
                $validated['image'] = $created_image_name;

                if ($course->image && $created_image_name) {
                    ImageHelper::deleteImage($course->image, 'assets/images/courses');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $course->update($validated);

        return redirect()->route('courses.index')->with('success', 'Course updated successfully!');
    }

    public function update_status(Request $request, Course $course)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $course->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        // Delete image if exists
        if ($course->image) {
            ImageHelper::deleteImage($course->image, 'assets/images/courses');
        }
        $course->delete();

        return redirect()->route('courses.index')->with('success', 'Course deleted successfully!');
    }
}
