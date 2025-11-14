<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:role view', only: ['index', 'show', 'all_roles']),
            new Middleware('permission:role create', only: ['create', 'store']),
            new Middleware('permission:role update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:role delete', only: ['destroy', 'destroy_image']),
        ];
    }
    public function all_roles()
    {
        return response()->json(Role::all());
    }
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');

        $query = Role::query();

        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('name', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);


        return Inertia::render('admin/roles/Index', [
            'tableData' => $tableData,
        ]);
    }

    public function create()
    {
        $role_permission = Permission::selectRaw('MIN(id) as id, name')
            ->groupBy('name')
            ->get();

        $custom_permission = [];

        foreach ($role_permission as $per) {
            $key = substr($per->name, 0, strpos($per->name, " "));
            if (str_starts_with($per->name, $key)) {
                $custom_permission[$key][] = $per;
            }
        }

        return Inertia::render('admin/roles/Create', [
            'permissions' => $custom_permission,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back()->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        $role_permission = Permission::selectRaw('MIN(id) as id, name')
            ->groupBy('name')
            ->get();

        $custom_permission = [];

        foreach ($role_permission as $per) {
            $key = substr($per->name, 0, strpos($per->name, " "));
            if (str_starts_with($per->name, $key)) {
                $custom_permission[$key][] = $per;
            }
        }

        return Inertia::render('admin/roles/Create', [
            'editData' => $role->load('permissions'),
            'permissions' => $custom_permission,
            'readOnly' => true,
        ]);
    }
    public function edit(Role $role)
    {
        $role_permission = Permission::selectRaw('MIN(id) as id, name')
            ->groupBy('name')
            ->get();

        $custom_permission = [];

        foreach ($role_permission as $per) {
            $key = substr($per->name, 0, strpos($per->name, " "));
            if (str_starts_with($per->name, $key)) {
                $custom_permission[$key][] = $per;
            }
        }

        return Inertia::render('admin/roles/Create', [
            'editData' => $role->load('permissions'),
            'permissions' => $custom_permission,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $request->name]);

        if ($request->permissions) {
            $role->syncPermissions($request->permissions);
        } else {
            $role->syncPermissions([]); // Remove all if none selected
        }

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        if (strtolower($role->name) == 'admin') {
            return redirect()->back()->with('error', 'The Admin role cannot be deleted.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully.');
    }

    // ==== For Assign Admin to the current login user ====
    public function assignAdmin(Request $request)
    {
        $user = $request->user();

        // Make sure the admin role exists
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->syncPermissions(Permission::all()); // Ensures admin always has all permissions

        // Assign the role to the user (if not already assigned)
        if (!$user->hasRole('Admin')) {
            $user->syncRoles($adminRole);
        }

        $user->update([
            'updated_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'User has been given the Admin role.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'roles' => $user->getRoleNames(), // Collection of role names
                'permissions' => $user->getAllPermissions()->pluck('name'), // All permissions (from roles + direct)
            ]
        ]);
    }
}
