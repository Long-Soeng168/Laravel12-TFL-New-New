<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        if (is_numeric($request->email)) {
            $userEmail = User::where('phone', $request->email)->first();

            if (!$userEmail) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $credentials['email'] = $userEmail->email;
        }

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $userRoles = $user->getRoleNames();
            // $userPermissions = $user->getPermissionsViaRoles()->pluck('name');

            unset($user['roles']);

            $token = $user->createToken('AuthToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
                'userRoles' => $userRoles,
                // 'userPermissions' => $userPermissions
            ], 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }
    public function user(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user = Auth::user();
            $userRoles = $user->getRoleNames();
            // $userPermissions = $user->getPermissionsViaRoles()->pluck('name');
            unset($user['roles']);
            return response()->json([
                'user' => $user,
                'userRoles' => $userRoles,
                // 'userPermissions' => $userPermissions
            ], 200);
        } else {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'required|unique:users',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'password' => Hash::make($request->password),
            'image' => null,
        ]);

        $user->assignRole('User');

        $token = $user->createToken('AuthToken')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user,  'userRoles' => ['User']], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'required|unique:users,phone,' . $id,
            'password' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $input = $request->all();

        if ($request->filled('password')) {
            $input['password'] = Hash::make($request->password);
        }

        $user = User::findOrFail($id);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/users/'), $filename);
            $input['image'] = $filename;
        }

        $user->update($input);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ], 200);
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json(['message' => 'User logged out successfully']);
    }
}
