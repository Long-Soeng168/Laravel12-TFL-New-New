<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class PartnerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:partner view', only: ['index', 'show']),
            new Middleware('permission:partner create', only: ['create', 'store']),
            new Middleware('permission:partner update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:partner delete', only: ['destroy', 'destroy_image']),
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

        $query = Partner::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('name', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/partners/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/partners/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:partners,name',
            'name_kh' => 'nullable|string|max:255',
            'phone' => 'nullable|numeric',
            'link' => 'nullable|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/partners', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        Partner::create($validated);

        return redirect()->route('partners.index')->with('success', 'Partner created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Partner $partner)
    {
        return Inertia::render('admin/partners/Show', [
            'partner' => $partner
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Partner $partner)
    {
        return Inertia::render('admin/partners/Edit', [
            'partner' => $partner
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:partners,name,' . $partner->id,
            'name_kh' => 'nullable|string|max:255',
            'phone' => 'nullable|numeric',
            'link' => 'nullable|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/partners', 600);
                $validated['image'] = $created_image_name;

                if ($partner->image && $created_image_name) {
                    ImageHelper::deleteImage($partner->image, 'assets/images/partners');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $partner->update($validated);

        return redirect()->route('partners.index')->with('success', 'Partner updated successfully!');
    }

    public function update_status(Request $request, Partner $partner)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $partner->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Partner $partner)
    {
        // Delete image if exists
        if ($partner->image) {
            ImageHelper::deleteImage($partner->image, 'assets/images/partners');
        }

        $partner->delete();

        return redirect()->route('partners.index')->with('success', 'Partner deleted successfully!');
    }
}
