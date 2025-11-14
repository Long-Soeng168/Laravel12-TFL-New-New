<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\ItemCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;

class ItemCategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:item view', only: ['index', 'show', 'all_item_categories']),
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
        $status = $request->input('status');

        $query = ItemCategory::query();

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

        return Inertia::render('admin/item_categories/Index', [
            'tableData' => $tableData,
        ]);
    }

    public function all_item_categories()
    {
        $query = ItemCategory::query();

        $tableData = $query->where('status', 'active')->orderBy('order_index')->get();

        return response()->json($tableData);
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
            'code' => 'required|string|max:255|unique:item_categories,code',
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_categories', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/item_categories', 900);
                $validated['banner'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        ItemCategory::create($validated);

        return redirect()->back()->with('success', 'Category created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ItemCategory $item_category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:item_categories,code,' . $item_category->code . ',code',
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/item_categories', 600);
                $validated['image'] = $created_image_name;

                if ($item_category->image && $created_image_name) {
                    ImageHelper::deleteImage($item_category->image, 'assets/images/item_categories');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/item_categories', 900);
                $validated['banner'] = $created_image_name;

                if ($item_category->banner && $created_image_name) {
                    ImageHelper::deleteImage($item_category->banner, 'assets/images/item_categories');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $old_code = $item_category->code; // current code before update
        $item_category->update($validated); // update parent

        // Now update children with old parent_code to new code
        if (isset($validated['code'])) {
            DB::table('item_categories')
                ->where('parent_code', $old_code)
                ->update(['parent_code' => $validated['code']]);
        }


        return redirect()->back()->with('success', 'Category updated successfully!');
    }


    public function update_status(Request $request, ItemCategory $item_category)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $item_category->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemCategory $item_category)
    {
        if ($item_category->image) {
            ImageHelper::deleteImage($item_category->image, 'assets/images/item_categories');
        }
        if ($item_category->banner) {
            ImageHelper::deleteImage($item_category->banner, 'assets/images/item_categories');
        }
        $item_category->delete();
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
