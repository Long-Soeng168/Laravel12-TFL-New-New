<?php

namespace App\Http\Controllers\UserDashboard;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use App\Models\Garage;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;

class UserGarageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Garage', only: ['edit', 'update', 'update_status']),
        ];
    }
    public function edit()
    {

        $all_users = User::orderBy('id', 'desc')
            ->where('garage_id', null)
            ->get();
        // return ($all_users);
        $user_garage = Garage::where('id', Auth::user()->garage_id)->first();
        if ($user_garage->id != Auth::user()->garage_id) {
            abort(404);
        }
        return Inertia::render('user-dashboard/garages/Create', [
            'editData' => $user_garage->load('owner'),
            'all_users' => $all_users,
        ]);
    }
    public function create()
    {
        $all_users = User::orderBy('id', 'desc')
            ->where('garage_id', null)
            ->get();
        // return ($all_users);
        $user_garage = Garage::where('id', Auth::user()->garage_id)->first();
        if ($user_garage) {
            abort(403);
        }

        return Inertia::render('user-dashboard/garages/Create', [
            'all_users' => $all_users,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
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
        $validated['owner_user_id'] = $request->user()->id;

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
            $user = User::where('id', Auth::user()->id)->where('garage_id', null)->first();
            $user->assignRole('Garage');
            if ($user)
                $user->update([
                    'garage_id' => $garage->id,
                ]);
        }

        return redirect('/user-dashboard')->with('success', 'Garage register successfully!');
    }

    public function update(Request $request, Garage $user_garage)
    {
        if ($user_garage->id != Auth::user()->garage_id) {
            abort(404);
        }
        $validated = $request->validate([
            'owner_user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'short_description_kh' => 'nullable|string|max:500',
            'parent_code' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|in:active,inactive',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        if ($validated['owner_user_id'] != $user_garage->owner_user_id) {
            User::where('id', $user_garage->owner_user_id)->update([
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

                if ($user_garage->logo && $created_image_name) {
                    ImageHelper::deleteImage($user_garage->logo, 'assets/images/garages');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        if ($banner_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($banner_file, 'assets/images/garages', 900);
                $validated['banner'] = $created_image_name;

                if ($user_garage->banner && $created_image_name) {
                    ImageHelper::deleteImage($user_garage->banner, 'assets/images/garages');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $updated_success = $user_garage->update($validated);

        if ($updated_success) {
            $user = User::where('id', $validated['owner_user_id'])->where('garage_id', null)->first();
            if ($user)
                $user->update([
                    'garage_id' => $user_garage->id,
                ]);
        }


        return redirect()->back()->with('success', 'Garage updated successfully!');
    }


    public function update_status(Request $request, Garage $user_garage)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $user_garage->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Garage $user_garage)
    {
        if ($user_garage->logo) {
            ImageHelper::deleteImage($user_garage->logo, 'assets/images/garages');
        }
        if ($user_garage->banner) {
            ImageHelper::deleteImage($user_garage->banner, 'assets/images/garages');
        }
        $user_garage->delete();
        return redirect()->back()->with('success', 'Garage deleted successfully.');
    }
}
