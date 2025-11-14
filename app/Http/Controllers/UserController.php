<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:user view', only: ['index', 'show']),
            new Middleware('permission:user create', only: ['create', 'store']),
            new Middleware('permission:user update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:user delete', only: ['destroy', 'destroy_image']),
        ];
    }
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = User::query();

        $query->with('created_by', 'updated_by', 'roles', 'shop');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('id', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy('id', 'desc');

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/users/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|max:255|confirmed', // Laravel auto-validates against confirm_password
            'phone' => 'nullable|numeric',
            'gender' => 'nullable|string|in:male,female,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'roles' => 'nullable|array'
        ]);
        // dd($validated );


        try {
            // Add creator and updater
            $validated['created_by'] = $request->user()->id;
            $validated['updated_by'] = $request->user()->id;

            // Hash the password
            $validated['password'] = Hash::make($validated['password']);

            // Extract and unset non-model fields
            $roles = $request->input('roles', []);
            $imageFile = $request->file('image');

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp($imageFile, 'assets/images/users', 600);
                $validated['image'] = $imageName;
            }

            // Remove null or empty string values
            foreach ($validated as $key => $value) {
                if ($value === null || $value === '') {
                    unset($validated[$key]);
                }
            }

            // Create the user
            $user = User::create($validated);

            // Assign roles
            if (!empty($roles)) {
                $user->syncRoles($roles);
            } else {
                $user->syncRoles('User');
            }

            return redirect()->back()->with('success', 'User create successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|max:255|confirmed', // Laravel auto-validates against confirm_password
            'phone' => 'nullable|numeric',
            'gender' => 'nullable|string|in:male,female,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
            'roles' => 'nullable|array'
        ]);

        try {
            // Add updater
            $validated['updated_by'] = $request->user()->id;

            // Hash the password
            if (!empty($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Extract and unset non-model fields
            $roles = $request->input('roles', []);
            $imageFile = $request->file('image');

            // Handle image upload if present
            if ($imageFile) {
                $imageName = ImageHelper::uploadAndResizeImageWebp($imageFile, 'assets/images/users', 600);
                $validated['image'] = $imageName;
                if ($imageName && $user->image) {
                    ImageHelper::deleteImage($user->image, 'assets/images/users');
                }
            }

            // Remove null or empty string values
            foreach ($validated as $key => $value) {
                if ($value === null || $value === '') {
                    unset($validated[$key]);
                }
            }

            // Create the user
            $user->update($validated);

            // Assign roles
            if (!empty($roles)) {
                $user->syncRoles($roles);
            } else {
                $user->syncRoles('User');
            }

            return redirect()->back()->with('success', 'User created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->image) {
            ImageHelper::deleteImage($user->image, 'assets/images/users');
        }
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
