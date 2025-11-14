<?php

namespace App\Http\Controllers;

use App\Helpers\FileHelper;
use App\Helpers\ImageHelper;
use App\Models\File as FileModel;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class FileController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:file_manager view', only: ['index', 'show']),
            new Middleware('permission:file_manager create', only: ['create', 'store']),
            new Middleware('permission:file_manager delete', only: ['destroy', 'destroy_image']),
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
        $folder_id = $request->input('folder_id', '');
        $fileType = $request->input('fileType', '');
        $query = FileModel::query();

        $query->with('created_by', 'updated_by');

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        if ($folder_id) {
            $query->where('folder_id', $folder_id);
        }

        $query->orderBy($sortBy, $sortDirection);

        if ($fileType) {
            switch ($fileType) {
                case 'image':
                    $query->where('mime_type', 'LIKE', 'image/%');
                    break;

                case 'pdf':
                    $query->where('mime_type', 'application/pdf');
                    break;

                case 'video':
                    $query->whereIn('mime_type', [
                        'video/mp4',
                        'video/webm',
                        'video/avi',
                    ]);
                    break;

                case 'audio':
                    $query->whereIn('mime_type', [
                        'audio/mpeg',    // .mp3
                        'audio/ogg',     // .ogg
                        'audio/wav',     // .wav
                    ]);
                    break;

                case 'office':
                    $query->whereIn('mime_type', [
                        'application/msword', // .doc
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                        'application/vnd.ms-excel', // .xls
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                    ]);
                    break;

                case 'archive':
                    $query->whereIn('mime_type', [
                        'application/zip',
                        'application/x-rar-compressed',
                    ]);
                    break;

                case 'text':
                    $query->whereIn('mime_type', [
                        'text/plain',   // .txt
                        'application/json',
                        'text/csv',
                    ]);
                    break;
            }
        }


        $tableData = $query->paginate(perPage: 24)->onEachSide(1);

        return response()->json($tableData);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $validated = $request->validate([
            'folder_id' => 'nullable|integer|max:255|exists:folders,id',
            'files' => 'required|array',
            // 'files.*' => 'mimes:jpeg,png,jpg,gif,svg,webp,pdf,doc,docx,xls,xlsx,txt,zip,rar,json,csv,mp4,mp3,ogg,wav,webm,avi|max:10240', // 10MB
        ]);

        $files = $request->file('files');
        unset($validated['files']);

        foreach ($validated as $key => $value) {
            if ($value === '') {
                $validated[$key] = null;
            }
        }

        $folder = 'assets/files/file_manager';
        $allExistFileNames = [];

        if (isset($validated['folder_id'])) {
            $currentFolder = Folder::findOrFail($validated['folder_id']);
            $folderPath = $currentFolder->path;
            foreach ($folderPath as $path) {
                $folder = $folder . '/' . $path['name'];
            }
            $folder = $folder . '/' . $currentFolder->name;
            // dd($folder);
        }

        if (count($files) > 0) {
            try {
                foreach ($files as $file) {
                    $mimeType = $file->getMimeType();
                    $size = $file->getSize(); // Get file size in bytes
                    $extension = $file->getClientOriginalExtension();
                    $fileName = $file->getClientOriginalName();

                    // Generate the full file path
                    $file_path_name = public_path("$folder/$fileName");

                    // Check for webp
                    $webp_file_name = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
                    $webp_path_name = public_path("$folder/$webp_file_name");
                    // Check if the file already exists
                    if (File::exists($file_path_name) || File::exists($webp_path_name)) {
                        $allExistFileNames[] = $fileName;
                    } else {
                        // Determine file type
                        if (str_starts_with($mimeType, 'image/')) {
                            $created_file_name = ImageHelper::uploadAndResizeImageWebp($file, $folder, 600, false);
                            // Get Image Dimensions
                            [$width, $height] = getimagesize($file);
                        } else {
                            $created_file_name = FileHelper::uploadFile($file, $folder);

                            // Non-image files have no dimensions
                            $width = null;
                            $height = null;
                        }

                        if (!empty($created_file_name)) {
                            $createdItem = FileModel::create([
                                'name' => $created_file_name,
                                'path' => $folder,
                                'mime_type' => $mimeType,
                                'extension' => $extension,
                                'size' => round($size / 1024, 2), // Convert bytes to KB
                                'width' => $width,
                                'height' => $height,
                                'folder_id' => $request->folder_id ?? null,
                                'created_by' => $request->user()->id,
                                'updated_by' => $request->user()->id,
                            ]);
                        }
                    }
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Failed to upload files: ' . $e->getMessage());
            }
        }

        if (count($allExistFileNames) > 0) {
            $response = redirect()->back()->with('warning', $allExistFileNames);

            if (count($allExistFileNames) < count($files)) {
                $response->with('success', 'Some files uploaded successfully.');
            }

            return $response;
        }

        return redirect()->back()->with('success', 'All files uploaded successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FileModel $file)
    {
        $folder = $file->path;
        FileHelper::deleteFile($file->name, $folder);
        $file->delete();
        return redirect()->back();
    }
}
