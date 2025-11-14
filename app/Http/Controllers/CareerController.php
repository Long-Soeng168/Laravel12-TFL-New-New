<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Career;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class CareerController extends Controller implements HasMiddleware
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

        $query = Career::query();

        $query->with('created_by', 'updated_by', 'position');

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

        return Inertia::render('admin/careers/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('admin/careers/Create', [
            'positions' => Position::where('status', 'active')->orderBy('id', 'desc')->get(),
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
            'short_description' => 'nullable|string|max:1000',
            'short_description_kh' => 'nullable|string|max:1000',
            'position_code' => 'required|string|exists:positions,code',
            'status' => 'nullable|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'location' => 'nullable|string|max:500',
            'industry' => 'nullable|string|max:500',
            'budget' => 'nullable|numeric|min:0',
            'qualification' => 'nullable|string',
            'skill' => 'nullable|string',
            'responsibility' => 'nullable|string',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/careers', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $created_project = Career::create($validated);

        return redirect()->back()->with('success', 'Team Created Successfully!.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Career $career)
    {
        return Inertia::render('admin/careers/Create', [
            'editData' => $career,
            'positions' => Position::where('status', 'active')->orderBy('id', 'desc')->get(),
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Career $career)
    {
        return Inertia::render('admin/careers/Create', [
            'editData' => $career,
            'positions' => Position::where('status', 'active')->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Career $career)
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:1000',
            'short_description_kh' => 'nullable|string|max:1000',
            'position_code' => 'nullable|string|exists:positions,code',
            'status' => 'nullable|string|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'location' => 'nullable|string|max:500',
            'industry' => 'nullable|string|max:500',
            'budget' => 'nullable|numeric|min:0',
            'qualification' => 'nullable|string',
            'skill' => 'nullable|string',
            'responsibility' => 'nullable|string',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/careers', 600);
                $validated['image'] = $created_image_name;
                if (!empty($created_image_name)) {
                    ImageHelper::deleteImage($career->image, 'assets/images/careers');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $career->update($validated);

        return redirect()->back()->with('success', 'Career Updated Successfully!.');
    }

    public function update_status(Request $request, Career $career)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $career->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Career $career)
    {
        if ($career->image) {
            ImageHelper::deleteImage($career->image, 'assets/images/careers');
        }
        $career->delete();
        return redirect()->back()->with('success', 'Career deleted successfully.');
    }
}
