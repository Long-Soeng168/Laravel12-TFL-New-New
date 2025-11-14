<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Http\Requests\StoreDtcRequest;
use App\Http\Requests\UpdateDtcRequest;
use App\Models\Dtc;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class DtcController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:dtc view', only: ['index', 'show']),
            new Middleware('permission:dtc create', only: ['create', 'store']),
            new Middleware('permission:dtc update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:dtc delete', only: ['destroy', 'destroy_image']),
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

        $query = Dtc::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('code', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%")
                    ->orWhere('status', 'LIKE', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/dtcs/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/dtcs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:dtcs,code',
            'short_description' => 'nullable|string|max:2000',
            'short_description_kh' => 'nullable|string|max:2000',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        Dtc::create($validated);

        return redirect()->route('dtcs.index')->with('success', 'Dtc created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dtc $dtc)
    {
        return Inertia::render('admin/dtcs/Show', [
            'dtc' => $dtc
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dtc $dtc)
    {
        return Inertia::render('admin/dtcs/Edit', [
            'dtc' => $dtc
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dtc $dtc)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:dtcs,code,' . $dtc->id,
            'short_description' => 'nullable|string|max:2000',
            'short_description_kh' => 'nullable|string|max:2000',
        ]);
        $validated['updated_by'] = $request->user()->id;

        $dtc->update($validated);

        return redirect()->route('dtcs.index')->with('success', 'Dtc updated successfully!');
    }

    public function update_status(Request $request, Dtc $dtc)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $dtc->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dtc $dtc)
    {
        $dtc->delete();

        return redirect()->route('dtcs.index')->with('success', 'Dtc deleted successfully!');
    }
}
