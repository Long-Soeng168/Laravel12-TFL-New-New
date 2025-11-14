<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\ItemBrand;
use App\Models\ItemCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;

class ItemBrandController extends Controller implements HasMiddleware
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

        $query = ItemBrand::query();

        if ($search) {
            $query->where(function ($subQuery) use ($search) {
                $subQuery->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%");
            });
        }


        $query->orderBy($sortBy, $sortDirection);
        $query->with('categories');

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        $item_categories = ItemCategory::orderBy('order_index')->orderBy('name')
            ->where('parent_code', null)
            ->where('status', 'active')
            ->with('children')
            ->get();

        // return ($tableData);

        return Inertia::render('admin/item_brands/Index', [
            'tableData' => $tableData,
            'item_categories' => $item_categories,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/item_brands/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $categoryCodes = collect($request->input('category_codes'))
            ->pluck('value')
            ->filter()
            ->toArray();

        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:item_brands,code',
            'name' => 'nullable|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_codes' => 'required|array',
            'category_codes.*.value' => 'required|exists:item_categories,code',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $validated['status'] = 'active';

        $image_file = $request->file('image');
        unset($validated['image']);
        unset($validated['category_codes']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_brands', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $brand = ItemBrand::create($validated);

        // Save pivot
        $pivotRows = array_map(function ($code) use ($brand) {
            return [
                'brand_code' => $brand->code,
                'category_code' => $code,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $categoryCodes);

        DB::table('brand_category')->insert($pivotRows);

        return redirect()->route('item_brands.index')->with('success', 'Item Brand created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(ItemBrand $item_brand)
    {
        return Inertia::render('admin/item_brands/Show', [
            'itemBrand' => $item_brand
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ItemBrand $item_brand)
    {
        return Inertia::render('admin/item_brands/Edit', [
            'itemBrand' => $item_brand->load('categories')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ItemBrand $item_brand)
    {
        $categoryCodes = collect($request->input('category_codes'))
            ->pluck('value')
            ->filter()
            ->values()
            ->toArray();

        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:item_brands,code,' . $item_brand->id,
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_codes' => 'required|array',
            'category_codes.*.value' => 'required|exists:item_categories,code',
        ]);
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        unset($validated['image']);
        unset($validated['category_codes']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_brands', 600);
                $validated['image'] = $created_image_name;

                if ($item_brand->image && $created_image_name) {
                    ImageHelper::deleteImage($item_brand->image, 'assets/images/item_brands');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $item_brand->update($validated);

        // 🔁 Sync categories
        DB::table('brand_category')
            ->where('brand_code', $item_brand->code)
            ->delete();

        $pivotRows = array_map(function ($code) use ($item_brand) {
            return [
                'brand_code' => $item_brand->code,
                'category_code' => $code,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $categoryCodes);

        DB::table('brand_category')->insert($pivotRows);

        return redirect()->route('item_brands.index')->with('success', 'Item Brand updated successfully!');
    }

    public function update_status(Request $request, ItemBrand $item_brand)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $item_brand->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemBrand $item_brand)
    {
        // Delete image if exists
        if ($item_brand->image) {
            ImageHelper::deleteImage($item_brand->image, 'assets/images/item_brands');
        }

        $item_brand->delete();

        return redirect()->route('item_brands.index')->with('success', 'Item Brand deleted successfully!'); //
    }
}
