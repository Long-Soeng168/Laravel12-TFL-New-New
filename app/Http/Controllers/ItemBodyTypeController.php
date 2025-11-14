<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\ItemBodyType;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ItemBodyTypeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:item view', only: ['index', 'show']),
            new Middleware('permission:item create', only: ['create', 'store']),
            new Middleware('permission:item update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:item delete', only: ['destroy', 'destroy_image']),
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

        $query = ItemBodyType::query();

        if ($search) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }


        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/item_body_types/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/item_body_types/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:item_body_types,code',
            'name' => 'nullable|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_body_types', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        ItemBodyType::create($validated);

        return redirect()->route('item_body_types.index')->with('success', 'Body Type created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemBodyType $item_body_type)
    {
        return Inertia::render('admin/item_body_types/Show', [
            'itemBrand' => $item_body_type
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemBodyType $item_body_type)
    {
        return Inertia::render('admin/item_body_types/Edit', [
            'itemBrand' => $item_body_type
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ItemBodyType $item_body_type)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:item_body_types,code,' . $item_body_type->id,
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_body_types', 600);
                $validated['image'] = $created_image_name;

                if ($item_body_type->image && $created_image_name) {
                    ImageHelper::deleteImage($item_body_type->image, 'assets/images/item_body_types');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $item_body_type->update($validated);

        return redirect()->route('item_body_types.index')->with('success', 'Body Type updated successfully!');
    }

    public function update_status(Request $request, ItemBodyType $item_body_type)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $item_body_type->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemBodyType $item_body_type)
    {
        // Delete image if exists
        if ($item_body_type->image) {
            ImageHelper::deleteImage($item_body_type->image, 'assets/images/item_body_types');
        }

        $item_body_type->delete();

        return redirect()->route('item_body_types.index')->with('success', 'Body Type deleted successfully!'); //
    }
}
