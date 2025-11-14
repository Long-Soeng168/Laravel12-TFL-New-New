<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\ItemBrand;
use App\Models\ItemModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ItemModelController extends Controller implements HasMiddleware
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

        $query = ItemModel::query();

        if ($search) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('name', 'LIKE', "%{$search}%")
                         ->orWhere('code', 'LIKE', "%{$search}%")
                         ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }


        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/item_models/Index', [
            'tableData' => $tableData,
            'itemBrands' => ItemBrand::where('status', 'active')->orderBy('id','desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/item_models/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:item_models,code',
            'brand_code' => 'required|string|max:255|exists:item_brands,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_models', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        ItemModel::create($validated);

        return redirect()->route('item_models.index')->with('success', 'Model created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemModel $item_model)
    {
        return Inertia::render('admin/item_models/Show', [
            'itemBrand' => $item_model
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemModel $item_model)
    {
        return Inertia::render('admin/item_models/Edit', [
            'itemBrand' => $item_model
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ItemModel $item_model)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:item_models,code,' . $item_model->id,
            'brand_code' => 'required|string|max:255|exists:item_brands,code',
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_models', 600);
                $validated['image'] = $created_image_name;

                if ($item_model->image && $created_image_name) {
                    ImageHelper::deleteImage($item_model->image, 'assets/images/item_models');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $item_model->update($validated);

        return redirect()->route('item_models.index')->with('success', 'Model updated successfully!');
    }

    public function update_status(Request $request, ItemModel $item_model)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $item_model->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemModel $item_model)
    {
        // Delete image if exists
        if ($item_model->image) {
            ImageHelper::deleteImage($item_model->image, 'assets/images/item_models');
        }

        $item_model->delete();

        return redirect()->route('item_models.index')->with('success', 'Model deleted successfully!');//
    }
}
