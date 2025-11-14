<?php

namespace App\Http\Controllers;

use App\Helpers\ImageHelper;
use App\Models\Link;
use App\Models\Page;
use App\Models\PageImage;
use App\Models\PagePosition;
use App\Models\Type;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class PageController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:page view', only: ['index', 'show']),
            new Middleware('permission:page create', only: ['create', 'store']),
            new Middleware('permission:page update', only: ['edit', 'update', 'update_status']),
            new Middleware('permission:page delete', only: ['destroy', 'destroy_image']),
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

        $query = Page::query();

        $query->with('created_by', 'updated_by', 'images', 'parent', 'position', 'source_detail');

        if ($status) {
            $query->where('status', $status);
        }
        $query->orderBy($sortBy, $sortDirection);

        if ($search) {
            $query->where(function ($sub_query) use ($search) {
                return $sub_query->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('title_kh', 'LIKE', "%{$search}%")
                    ->orWhere('code', 'LIKE', "%{$search}%")
                    ->orWhere('position_code', 'LIKE', "%{$search}%")
                    ->orWhere('short_description', 'LIKE', "%{$search}%")
                    ->orWhere('short_description_kh', 'LIKE', "%{$search}%")
                    ->orWhereHas('parent', function ($parent_query) use ($search) {
                        $parent_query->where('title', 'LIKE', "%{$search}%")
                            ->orWhere('title_kh', 'LIKE', "%{$search}%");
                    });;
            });
        }

        $tableData = $query->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('admin/pages/Index', [
            'tableData' => $tableData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {

        $query = Page::query();

        $parentData = $query->orderBy('order_index')->where('status', 'active')->get();
        return Inertia::render('admin/pages/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'parentData' => $parentData,
            'pagePositions' => PagePosition::where('status', 'active')->orderBy('id', 'desc')->get(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'page'])->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'nullable|string|max:255|unique:pages,code',
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:1000',
            'short_description_kh' => 'nullable|string|max:1000',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer|min:0',
            'parent_id' => 'nullable|numeric',
            'position_code' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        $image_files = $request->file('images');
        unset($validated['images']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        $created_project = Page::create($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/pages', 600);
                    PageImage::create([
                        'image' => $created_image_name,
                        'page_id' => $created_project->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        return redirect()->back()->with('success', 'Page Created Successfully!.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        $query = Page::query();

        $parentData = $query->orderBy('order_index')->where('status', 'active')->where('id', '!=', $page->id)->get();
        return Inertia::render('admin/pages/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $page->load('images'),
            'parentData' => $parentData,
            'pagePositions' => PagePosition::all(),
            'types' => Type::where(['status' => 'active', 'type_of' => 'page'])->orderBy('id', 'desc')->get(),
            'readOnly' => true,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    public function edit(Page $page)
    {

        $query = Page::query();

        $parentData = $query->orderBy('order_index')->where('status', 'active')->where('id', '!=', $page->id)->get();
        return Inertia::render('admin/pages/Create', [
            'links' => Link::orderBy('title')->where('status', 'active')->get(),
            'editData' => $page->load('images'),
            'parentData' => $parentData,
            'types' => Type::where(['status' => 'active', 'type_of' => 'page'])->orderBy('id', 'desc')->get(),
            'pagePositions' => PagePosition::where('status', 'active')->orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        // dd($request->all());
        $validated = $request->validate([
            'code' => 'nullable|string|max:255|unique:pages,code,' . $page->id,
            'title' => 'required|string|max:255',
            'title_kh' => 'nullable|string|max:255',
            'short_description' => 'nullable|string|max:1000',
            'short_description_kh' => 'nullable|string|max:1000',
            'long_description' => 'nullable|string',
            'long_description_kh' => 'nullable|string',
            'link' => 'nullable|string|max:255',
            'source' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer|min:0',
            'parent_id' => 'nullable|numeric',
            'position_code' => 'nullable|string',
            'type' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg,webp|max:2048',
        ]);

        $validated['updated_by'] = $request->user()->id;

        $image_files = $request->file('images');
        unset($validated['images']);

        // foreach ($validated as $key => $value) {
        //     if ($value === null || $value === '') {
        //         unset($validated[$key]);
        //     }
        // }

        $page->update($validated);

        if ($image_files) {
            try {
                foreach ($image_files as $image) {
                    $created_image_name = ImageHelper::uploadAndResizeImageWebp($image, 'assets/images/pages', 600);
                    PageImage::create([
                        'image' => $created_image_name,
                        'page_id' => $page->id,
                    ]);
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
            }
        }
        return redirect()->back()->with('success', 'Page Updated Successfully!.');
    }

    public function update_status(Request $request, Page $page)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);
        $page->update([
            'status' => $request->status,
        ]);

        return redirect()->back()->with('success', 'Status updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        if (count($page->images) > 0) {
            foreach ($page->images as $image) {
                ImageHelper::deleteImage($image->image, 'assets/images/pages');
            }
        }
        $page->delete();
        return redirect()->back()->with('success', 'page deleted successfully.');
    }

    public function destroy_image(PageImage $image)
    {
        // Debugging (Check if model is found)
        if (!$image) {
            return redirect()->back()->with('error', 'Image not found.');
        }

        // Call helper function to delete image
        ImageHelper::deleteImage($image->image, 'assets/images/pages');

        // Delete from DB
        $image->delete();

        return redirect()->back()->with('success', 'Image deleted successfully.');
    }
}
