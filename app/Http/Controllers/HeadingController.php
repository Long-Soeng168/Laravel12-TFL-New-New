<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Http\Requests\StoreHeadingRequest;
use App\Http\Requests\UpdateHeadingRequest;
use App\Models\Heading;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class HeadingController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:heading view', only: ['index', 'show']),
            new Middleware('permission:heading create', only: ['create', 'store']),
            new Middleware('permission:heading update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:heading delete', only: ['destroy', 'destroy_image']),
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

        $query = Heading::query();

        $query->with('created_by', 'updated_by');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/headings/Index', [
            'tableData' => $tableData,
        ]);
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
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:headings,code',
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

      
        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        Heading::create($validated);

        return redirect()->back()->with('success', 'Heading created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Heading $heading)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Heading $heading)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Heading $heading)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'code' => 'required|string|max:255|unique:headings,code,'. $heading->id,
            'short_description' => 'nullable|string|max:255',
            'short_description_kh' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $validated['updated_by'] = $request->user()->id;

      
        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}
        $heading->update($validated);

        return redirect()->back()->with('success', 'Heading created successfully!');
    }



    public function update_status(Request $request, Heading $heading)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $heading->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Heading $heading)
    {
        
        $heading->delete();
        return redirect()->back()->with('success', 'Position deleted successfully.');
    }
}
