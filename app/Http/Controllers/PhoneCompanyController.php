<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Http\Requests\StorePhoneCompanyRequest;
use App\Http\Requests\UpdatePhoneCompanyRequest;
use App\Models\PhoneCompany;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class PhoneCompanyController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:partner view', only: ['index', 'show']),
            new Middleware('permission:partner create', only: ['create', 'store']),
            new Middleware('permission:partner update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:partner delete', only: ['destroy', 'destroy_image']),
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

        $query = PhoneCompany::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('company', 'LIKE', "%{$search}%")
                    ->orWhere('status', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/phone_companies/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/phone_companies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:phone_companies,code',
            'company' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/phone_companies', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        PhoneCompany::create($validated);

        return redirect()->route('phone_companies.index')->with('success', 'Phone Company created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(PhoneCompany $phone_company)
    {
        return Inertia::render('admin/phone_companies/Show', [
            'phone_company' => $phone_company
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PhoneCompany $phone_company)
    {
        return Inertia::render('admin/phone_companies/Edit', [
            'phone_company' => $phone_company
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PhoneCompany $phone_company)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:phone_companies,code,' . $phone_company->id,
            'company' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'nullable|string|in:active,inactive',

        ]);
        $validated['updated_by'] = $request->user()->id;

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/phone_companies', 600);
                $validated['image'] = $created_image_name;

                if ($phone_company->image && $created_image_name) {
                    ImageHelper::deleteImage($phone_company->image, 'assets/images/phone_companies');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }
        $phone_company->update($validated);

        return redirect()->route('phone_companies.index')->with('success', 'Phone Company updated successfully!');
    }

    public function update_status(Request $request, PhoneCompany $phone_company)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $phone_company->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PhoneCompany $phone_company)
    {
        // Delete image if exists
        if ($phone_company->image) {
            ImageHelper::deleteImage($phone_company->image, 'assets/images/phone_companies');
        }
        $phone_company->delete();

        return redirect()->route('phone_companies.index')->with('success', 'Phone Company deleted successfully!');
    }
}
