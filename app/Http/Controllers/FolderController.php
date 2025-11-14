<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateFolderRequest;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Folder::query();
        $query->with('parent', 'children');
        $query->orderBy('created_at', 'desc');
        $query->where('parent_id', null);
        $tableData = $query->get();
        return response()->json($tableData);
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
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|numeric|exists:folders,id',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['updated_by'] = $request->user()->id;

        foreach ($validated as $key => $value) {
    if ($value === '') {
        $validated[$key] = null;
    }
}

        $folder = 'assets/files/file_manager';

        if (isset($validated['parent_id'])) {
            $currentFolder = Folder::findOrFail($validated['parent_id']);
            $folderPath = $currentFolder->path;
            foreach ($folderPath as $path) {
                $folder = $folder . '/' . $path['name'];
            }
            $folder = $folder . '/' . $currentFolder->name;
            // dd($folder);
        }
        $validated['folder_path'] = $folder;


        $findedExistFolder = Folder::whereRaw('LOWER(name) = ?', [Str::lower($validated['name'])])
            ->where('folder_path', $folder)
            ->first();
        if ($findedExistFolder) {
            return redirect()->back()->with('warning', 'Folder already exists.');
        }


        $folder = Folder::create($validated);

        return redirect()->back()->with('success', 'Folder created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFolderRequest $request, Folder $folder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        $folderPath = public_path('/' . $folder->folder_path . '/' . $folder->name);
        if (File::exists($folderPath)) {
            File::deleteDirectory($folderPath); // this deletes folder + everything inside
        }

        $folder->delete();

        return redirect()->back()->with('success', 'Folder deleted successfully.');
    }
}
