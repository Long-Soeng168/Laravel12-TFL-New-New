<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Link;
use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class LinkController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:link view', only: ['index', 'show']),
            new Middleware('permission:link create', only: ['create', 'store']),
            new Middleware('permission:link update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:link delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $status = $request->input('status', '');
        $sortDirection = $request->input('sortDirection', 'desc');

        $query = Link::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('title', 'LIKE', "%{$search}%");
            });
        }
        if ($status) {
            $query->where("status", $status);
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/links/Index', [
            'tableData' => $tableData,
            'types' => Type::where(['status' => 'active', 'type_of' => 'link'])->orderBy('id', 'desc')->get(),
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/links/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/links', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        Link::create($validated);

        return redirect()->back()->with('success', 'Link created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Link $link)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Link $link)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Link $link)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'type' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/links', 600);
                $validated['image'] = $created_image_name;

                if ($link->image && $created_image_name) {
                    ImageHelper::deleteImage($link->image, 'assets/images/links');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $link->update($validated);

        return redirect()->back()->with('success', 'Link updated successfully!');
    }

    public function update_status(Request $request, Link $link)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $link->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $link = Link::findOrFail($id); // Better to use findOrFail for automatic 404 if not found
        $link->delete();

        return redirect()->back()->with('success', 'Project deleted successfully!');
    }
}
