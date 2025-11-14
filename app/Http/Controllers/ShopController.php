<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\ItemCategory;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ShopController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:shop view', only: ['index', 'show', 'all_shops']),
            new Middleware('permission:shop create', only: ['create', 'store']),
            new Middleware('permission:shop update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:shop delete', only: ['destroy', 'destroy_image']),
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

        $query = Shop::query();

        $query->with('created_by', 'updated_by', 'owner');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('address', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/shops/Index', [
            'tableData' => $tableData,
        ]);
    }

    public function all_shops()
    {
        $query = Shop::query();

        $tableData = $query->where('status', 'active')->orderBy('id', 'desc')->get();

        return response()->json($tableData);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function show(Shop $shop)
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('shop_id', null)
            ->get();

        $itemCategories = ItemCategory::where('parent_code', null)->where('status', 'active')->orderBy('name')->orderBy('name')->get();

        // return ($all_users);
        // return $shop->load('owner');
        return Inertia::render('admin/shops/Create', [
            'editData' => $shop->load('owner'),
            'all_users' => $all_users,
            'readOnly' => true,
            'itemCategories' => $itemCategories,
        ]);
    }
    public function edit(Shop $shop)
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('shop_id', null)
            ->get();

        $itemCategories = ItemCategory::where('parent_code', null)->where('status', 'active')->orderBy('name')->orderBy('name')->get();
        // return ($all_users);
        return Inertia::render('admin/shops/Create', [
            'editData' => $shop->load('owner', 'category'),
            'all_users' => $all_users,
            'itemCategories' => $itemCategories,
        ]);
    }

    public function create()
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('shop_id', null)
            ->get();
        $itemCategories = ItemCategory::where('parent_code', null)->where('status', 'active')->orderBy('name')->orderBy('name')->get();

        // return ($all_users);
        return Inertia::render('admin/shops/Create', [
            'all_users' => $all_users,
            'itemCategories' => $itemCategories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'category_code' => 'required|string|exists:item_categories,code',
            'owner_user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'bank_account' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('logo');
        $banner_file = $request->file('banner');
        unset($validated['logo']);
        unset($validated['banner']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }


        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/shops', 600);
                $validated['logo'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/shops', 1200);
                $validated['banner'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $shop = Shop::create($validated);

        if ($shop) {
            $user = User::where('id', $validated['owner_user_id'])->where('shop_id', null)->first();
            if ($user)
                $user->update([
                    'shop_id' => $shop->id,
                ]);
        }

        return redirect()->back()->with('success', 'Shop created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'category_code' => 'required|string|exists:item_categories,code',
            'owner_user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'bank_account' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive,pending,reject',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        if ($validated['owner_user_id'] != $shop->owner_user_id) {
            User::where('id', $shop->owner_user_id)->update([
                'shop_id' => null,
            ]);
        }

        $image_file = $request->file('logo');
        $banner_file = $request->file('banner');
        unset($validated['logo']);
        unset($validated['banner']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/shops', 600);
                $validated['logo'] = $created_image_name;

                if ($shop->logo && $created_image_name) {
                    ImageHelper::deleteImage($shop->logo, 'assets/images/shops');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/shops', 1200);
                $validated['banner'] = $created_image_name;

                if ($shop->banner && $created_image_name) {
                    ImageHelper::deleteImage($shop->banner, 'assets/images/shops');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $updated_success = $shop->update($validated);

        if ($updated_success) {
            $user = User::where('id', $validated['owner_user_id'])->where('shop_id', null)->first();
            if ($user)
                $user->update([
                    'shop_id' => $shop->id,
                ]);
        }


        return redirect()->back()->with('success', 'Shop updated successfully!');
    }


    public function update_status(Request $request, Shop $shop)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive,pending,reject',
        ]);
        $shop->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop $shop)
    {

        if ($shop->logo) {
            ImageHelper::deleteImage($shop->logo, 'assets/images/shops');
        }
        if ($shop->banner) {
            ImageHelper::deleteImage($shop->banner, 'assets/images/shops');
        }
        $shop->delete();
        $owner = User::where('id', $shop->owner_user_id)->first();
        if ($owner) {
            $owner->removeRole('Shop');
            $owner->update([
                'shop_id' => null,
            ]);
        }
        return redirect()->back()->with('success', 'Shop deleted successfully.');
    }
}
