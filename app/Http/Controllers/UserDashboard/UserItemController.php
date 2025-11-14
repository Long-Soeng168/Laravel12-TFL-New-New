<?php

namespace App\Http\Controllers\UserDashboard;

use App\Exports\ItemDailyViewExport;
use App\Helpers\ImageHelper;
use App\Helpers\TelegramHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\ItemBodyType;
use App\Models\ItemBrand;
use App\Models\Link;
use App\Models\ItemCategory;
use App\Models\ItemDailyView;
use App\Models\ItemImage;
use App\Models\ItemModel;
use App\Models\Shop;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class UserItemController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Shop', only: ['index', 'show']),
            new Middleware('role:Shop', only: ['create', 'store']),
            new Middleware('role:Shop', only: ['edit', 'update', 'update_status']),
            new Middleware('role:Shop', only: ['destroy', 'destroy_image']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Item::query();

        $query->with('created_by', 'updated_by', 'images', 'category', 'shop');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('name_kh', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }

        $query->where('shop_id', $request->user()->shop_id);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        // return $tableData;
        return Inertia::render('user-dashboard/items/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $itemCategories = ItemCategory::where('parent_code', null)->with('children.children')->where('status', 'active')->orderBy('name')->orderBy('name')->get();

        $itemBrands = ItemBrand::with(['categories'])->where('status', 'active')->orderBy('name')->get();
        $itemBrands = $itemBrands->map(function ($brand) {
            return [
                'id' => $brand->id,
                'code' => $brand->code,
                'image' => $brand->image,
                'name' => $brand->name,
                'name_kh' => $brand->name_kh,
                'categories' => $brand->categories->pluck('code')->values(), // values() to reset keys
            ];
        });

        $user = $request->user()->load('shop');
        $userShopCategory = $user->shop->category ?? null;
        // return ($user->shop->category_code);

        return Inertia::render('user-dashboard/items/Create', [
            'itemCategories' => $itemCategories,
            'itemBrands' => $itemBrands,
            'shops' => Shop::orderBy('name')->get(),
            'userShopCategory' => $userShopCategory,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'category_code' => 'required|string|exists:item_categories,code',
            'brand_code' => 'nullable|string|exists:item_brands,code',
            'model_code' => 'nullable|string|exists:item_models,code',
            'body_type_code' => 'nullable|string|exists:item_body_types,code',
            'status' => 'nullable|string|in:active,inactive',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);


        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;
        $validated['shop_id'] = $request->user()->shop_id;
        // $validated['post_date'] = Carbon::parse($validated['post_date'])->setTimezone('Asia/Bangkok')->startOfDay()->toDateString();


        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        $created_item = Item::create($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/items', 600);
                    ItemImage::create([
                        'image' => $created_image_name,
                        'item_id' => $created_item->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        // $result = TelegramHelper::sendItemToTelegram($created_item->id);

        // if (!$result['success']) {
        //     session()->flash('error', $result['message']);
        //     session()->flash('success', 'Item Created Successfully!.');
        // } else {
        //     session()->flash('success', 'Item Created Successfully!.');
        // }
        return redirect()->back()->with('success', 'Item Created Successfully!.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        $editData = $user_item->load('images', 'category', 'brand');
        $itemCategories = ItemCategory::where('parent_code', null)->with('children.children')->where('status', 'active')->orderBy('name')->orderBy('name')->get();

        $itemBrands = ItemBrand::with(['categories'])->where('status', 'active')->orderBy('name')->get();
        $itemBrands = $itemBrands->map(function ($brand) {
            return [
                'id' => $brand->id,
                'code' => $brand->code,
                'image' => $brand->image,
                'name' => $brand->name,
                'name_kh' => $brand->name_kh,
                'categories' => $brand->categories->pluck('code')->values(), // values() to reset keys
            ];
        });
        return Inertia::render('user-dashboard/items/Create', [
            'editData' => $editData,
            'readOnly' => true,
            'itemCategories' => $itemCategories,
            'itemBrands' => $itemBrands,
            'shops' => Shop::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }

        $editData = $user_item->load('images', 'category', 'brand');
        $itemCategories = ItemCategory::where('parent_code', null)->with('children.children')->where('status', 'active')->orderBy('name')->orderBy('name')->get();

        $itemBrands = ItemBrand::with(['categories'])->where('status', 'active')->orderBy('name')->get();
        $itemBrands = $itemBrands->map(function ($brand) {
            return [
                'id' => $brand->id,
                'code' => $brand->code,
                'image' => $brand->image,
                'name' => $brand->name,
                'name_kh' => $brand->name_kh,
                'categories' => $brand->categories->pluck('code')->values(), // values() to reset keys
            ];
        });

        return Inertia::render('user-dashboard/items/Create', [
            'editData' => $editData,
            'itemCategories' => $itemCategories,
            'itemBrands' => $itemBrands,
            'shops' => Shop::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        // dd($request->all());
        $validated = $request->validate([
            'code' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'short_description' => 'nullable|string',
            'short_description_kh' => 'nullable|string',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'category_code' => 'required|string|exists:item_categories,code',
            'brand_code' => 'nullable|string|exists:item_brands,code',
            'model_code' => 'nullable|string|exists:item_models,code',
            'body_type_code' => 'nullable|string|exists:item_body_types,code',
            'status' => 'nullable|string|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;
        // $validated['post_date'] = Carbon::parse($validated['post_date'])->setTimezone('Asia/Bangkok')->startOfDay()->toDateString();

        $image_files = $request->file('images');
        unset($validated['images']);

        // foreach ($validated as $key => $value) {
        //     if ($value === null || $value === '') {
        //         unset($validated[$key]);
        //     }
        // }

        $user_item->update($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/items', 600);
                    ItemImage::create([
                        'image' => $created_image_name,
                        'item_id' => $user_item->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        return redirect()->back()->with('success', 'Item Updated Successfully!.');
    }

    public function update_status(Request $request, Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $user_item->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $user_item)
    {
        if ($user_item->shop_id != Auth::user()->shop_id) {
            abort(404);
        }
        if (count($user_item->images) > 0) {
            foreach ($user_item->images as $image) {
                ImageHelper::deleteImage($image->image, 'assets/images/items');
            }
        }
        $user_item->delete();
        return redirect()->back()->with('success', 'Item deleted successfully.');
    }

    public function destroy_image(ItemImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/items');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }


    public function item_view_counts(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'view_date');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');
        $from_date = $request->input('from_date', null);
        $to_date = $request->input('to_date', null);


        $from_date = $from_date
            ? Carbon::parse($from_date)->setTimezone('Asia/Bangkok')->startOfDay()->toDateString()
            : Carbon::now()->setTimezone('Asia/Bangkok')->startOfYear()->toDateString();
        $to_date = $to_date
            ? Carbon::parse($to_date)->setTimezone('Asia/Bangkok')->endOfDay()->toDateString()
            : now()->endOfDay()->toDateString();

        $query = ItemDailyView::query();


        if ($from_date) {
            // dd($from_date);
            $query->where('view_date', '>=', $from_date);
        }

        if ($to_date) {
            $query->where('view_date', '<=', $to_date);
        }

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        $query->with('item');

        if ($search) {
            $query->whereHas('item', function ($subQuery) use ($search) {
                $subQuery->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%");
            });
        }
        // Clone the query for total views calculation
        $totalViews = (clone $query)->sum('view_counts');

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('user-dashboard/items/ItemViewCount', [
            'tableData' => $tableData,
            'totalViews' => $totalViews,
            'from_date' => $from_date,
            'to_date' => $to_date,
        ]);
    }

    public function item_view_counts_export(Request $request)
    {
        // dd($request->all());
        $from_date = $request->input('from_date', null);
        $to_date = $request->input('to_date', null);

        $from_date = $from_date
            ? Carbon::parse($from_date)->setTimezone('Asia/Bangkok')->startOfDay()->toDateString()
            : Carbon::now()->setTimezone('Asia/Bangkok')->startOfYear()->toDateString();
        $to_date = $to_date
            ? Carbon::parse($to_date)->setTimezone('Asia/Bangkok')->endOfDay()->toDateString()
            : now()->endOfDay()->toDateString();
        // dd($from_date, $to_date);

        $filters = [
            'search' => $request->input('search', ''),
            'status' => $request->input('status'),
            'sortBy' => $request->input('sortBy', 'view_date'),
            'sortDirection' => $request->input('sortDirection', 'desc'),
            'from_date' => $from_date,
            'to_date' => $to_date,
        ];

        return Excel::download(new ItemDailyViewExport($filters), 'item_views.xlsx');
    }
}
