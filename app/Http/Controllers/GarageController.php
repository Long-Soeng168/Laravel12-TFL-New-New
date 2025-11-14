<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Garage;
use App\Models\ItemBrand;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class GarageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:garage view', only: ['index', 'show', 'all_garages']),
            new Middleware('permission:garage create', only: ['create', 'store']),
            new Middleware('permission:garage update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:garage delete', only: ['destroy', 'destroy_image']),
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

        $query = Garage::query();

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

        return Inertia::render('admin/garages/Index', [
            'tableData' => $tableData,
        ]);
    }

    public function all_garages()
    {
        $query = Garage::query();

        $tableData = $query->where('status', 'active')->orderBy('id', 'desc')->get();

        return response()->json($tableData);
    }

    /**
     * Show the form for creating a new resource.
     */

    public function show(Garage $garage)
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('garage_id', null)
            ->get();
        $all_brands = ItemBrand::orderBy('name')
            ->where('status', 'active')
            ->get();
        // return ($all_users);
        // return $garage->load('owner');
        return Inertia::render('admin/garages/Create', [
            'editData' => $garage->load('owner'),
            'all_users' => $all_users,
            'all_brands' => $all_brands,
            'readOnly' => true,
        ]);
    }
    public function edit(Garage $garage)
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('garage_id', null)
            ->get();
        $all_brands = ItemBrand::orderBy('name')
            ->where('status', 'active')
            ->get();
        // return ($all_users);
        return Inertia::render('admin/garages/Create', [
            'editData' => $garage->load('owner'),
            'all_users' => $all_users,
            'all_brands' => $all_brands,
        ]);
    }

    public function create()
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('garage_id', null)
            ->get();
        $all_brands = ItemBrand::orderBy('name')
            ->where('status', 'active')
            ->get();
        // return ($all_users);
        return Inertia::render('admin/garages/Create', [
            'all_users' => $all_users,
            'all_brands' => $all_brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'owner_user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'brand_code' => 'nullable|string|max:255',
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/garages', 600);
                $validated['logo'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/garages', 900);
                $validated['banner'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $garage = Garage::create($validated);

        if ($garage) {
            $user = User::where('id', $validated['owner_user_id'])->where('garage_id', null)->first();
            if ($user)
                $user->update([
                    'garage_id' => $garage->id,
                ]);
        }

        return redirect()->back()->with('success', 'Garage created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Garage $garage)
    {
        $validated = $request->validate([
            'owner_user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'brand_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        if ($validated['owner_user_id'] != $garage->owner_user_id) {
            User::where('id', $garage->owner_user_id)->update([
                'garage_id' => null,
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
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/garages', 600);
                $validated['logo'] = $created_image_name;

                if ($garage->logo && $created_image_name) {
                    ImageHelper::deleteImage($garage->logo, 'assets/images/garages');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/garages', 900);
                $validated['banner'] = $created_image_name;

                if ($garage->banner && $created_image_name) {
                    ImageHelper::deleteImage($garage->banner, 'assets/images/garages');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $updated_success = $garage->update($validated);

        if ($updated_success) {
            $user = User::where('id', $validated['owner_user_id'])->where('garage_id', null)->first();
            if ($user)
                $user->update([
                    'garage_id' => $garage->id,
                ]);
        }


        return redirect()->back()->with('success', 'Garage updated successfully!');
    }


    public function update_status(Request $request, Garage $garage)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $garage->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Garage $garage)
    {

        if ($garage->logo) {
            ImageHelper::deleteImage($garage->logo, 'assets/images/garages');
        }
        if ($garage->banner) {
            ImageHelper::deleteImage($garage->banner, 'assets/images/garages');
        }
        $garage->delete();
        $owner = User::where('id', $garage->owner_user_id)->first();
        if ($owner) {
            $owner->removeRole('Garage');
            $owner->update([
                'garage_id' => null,
            ]);
        }
        return redirect()->back()->with('success', 'Garage deleted successfully.');
    }
}
