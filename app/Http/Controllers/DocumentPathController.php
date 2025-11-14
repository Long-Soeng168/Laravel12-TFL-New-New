<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\DocumentPath;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class DocumentPathController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:document view', only: ['index', 'show']),
            new Middleware('permission:document create', only: ['create', 'store']),
            new Middleware('permission:document update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:document delete', only: ['destroy', 'destroy_image']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $status = $request->input('status', '');
        $sortDirection = $request->input('sortDirection', 'desc');

        $query = DocumentPath::query();

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                $sub_query->where('name', 'LIKE', "%{$search}%");
            });
        }
        if ($status) {
            $query->where("status", $status);
        }

        $query->orderBy($sortBy, $sortDirection);

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/document_paths/Index', [
            'tableData' => $tableData,
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/document_paths/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'path' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/document_paths', 600);
                $validated['image'] = $created_image_name;
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        DocumentPath::create($validated);

        return redirect()->back()->with('success', 'Document Path created successfully!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentPath $document_path)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_kh' => 'nullable|string|max:255',
            'path' => 'nullable|string|max:255',
            'order_index' => 'nullable|numeric|max:255',
            'status' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
        ]);

        $image_file = $request->file('image');
        unset($validated['image']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        if ($image_file) {
            try {
                $created_image_name = ImageHelper::uploadAndResizeImageWebp($image_file, 'assets/images/document_paths', 600);
                $validated['image'] = $created_image_name;

                if ($document_path->image && $created_image_name) {
                    ImageHelper::deleteImage($document_path->image, 'assets/images/document_paths');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload image: ' . $e->getMessage());
            }
        }

        $document_path->update($validated);

        return redirect()->back()->with('success', 'Document Path updated successfully!');
    }

    public function update_status(Request $request, DocumentPath $document_path)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $document_path->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $document_path = DocumentPath::findOrFail($id); // Better to use findOrFail for automatic 404 if not found
        $document_path->delete();

        return redirect()->back()->with('success', 'Document Path deleted successfully!');
    }
}
