<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTypeRequest;
use App\Http\Requests\UpdateTypeRequest;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDirection', 'desc');
        $status = $request->input('status');

        $query = Type::query();

        $query->with('created_by', 'updated_by');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('type', 'LIKE', "%{$search}%")
                    ->orWhere('type_of', 'LIKE', "%{$search}%");
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/types/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                'max:255',
                Rule::unique('types')->where(function ($query) use ($request) {
                    return $query->where('type_of', $request->input('type_of'));
                }),
            ],
            'label' => 'required|string|max:255',
            'type_of' => 'nullable|string|max:255',
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


        Type::create($validated);

        return redirect()->back()->with('success', 'Type created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Type $type)
    {
        $validated = $request->validate([
            'type' => [
                'required',
                'string',
                'max:255',
                Rule::unique('types')->where(function ($query) use ($request) {
                    return $query->where('type_of', $request->input('type_of'));
                })->ignore($type->id),
            ],
            'label' => 'required|string|max:255',
            'type_of' => 'nullable|string|max:255',
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

        $type->update($validated);


        return redirect()->back()->with('success', 'Type updated successfully!');
    }

    public function update_status(Request $request, Type $type)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $type->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    public function destroy(Type $type)
    {
        $type->delete();
        return redirect()->back()->with('success', 'Type deleted successfully.');
    }
}
