<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\ImageHelper;
use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        // dd($request->all());
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'phone' => ['required', 'string', 'min:8', 'max:20', Rule::unique('users')->ignore($request->user()->id)],
            'gender' => ['nullable', 'in:male,female,other'],
        ]);

        $user = $request->user();

        if ($request->hasFile('image')) {
            $image_created_name = ImageHelper::uploadAndResizeImageWebp($request->file('image'), 'assets/images/users', 600);
            if ($image_created_name) {
                ImageHelper::deleteImage($user->image, 'assets/images/users');
                $validated['image'] = $image_created_name;
            }
        }

        $user->update($validated);

        return to_route('profile.edit');
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
