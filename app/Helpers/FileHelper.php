<?php

namespace App\Helpers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class FileHelper
{
    public static function uploadFile($file, $folder = 'assets/files/file_manager', $timePrefixFileName = false)
    {
        if (!$file) {
            return null;
        }

        if ($timePrefixFileName) {
            $file_name = time() . '_' . $file->getClientOriginalName();
        } else {
            $file_name = $file->getClientOriginalName();
        }

        // Define paths
        $file_path = public_path("$folder/");

        // Create directories if they don't exist
        if (!File::exists($file_path)) {
            File::makeDirectory($file_path, 0755, true, true);
        }

        // Store Original Image
        $file->storeAs("$folder", $file_name, 'real_public');

        return $file_name;
    }

    /**
     * Delete an image and its thumbnail from storage.
     *
     * @param string|null $imageName The name of the image file.
     * @param string $folder The folder where the image is stored.
     * @return bool Returns true if deleted, false otherwise.
     */
    public static function deleteFile($fileName, $folder ='assets/files/file_manager',)
    {
        if (!$fileName) {
            return false;
        }

        $file_path = public_path("$folder/$fileName");
        $file_thumb_path = public_path("$folder/thumb/$fileName");

        // Delete main image
        if (File::exists($file_path)) {
            File::delete($file_path);
        }

        // Delete thumbnail
        if (File::exists($file_thumb_path)) {
            File::delete($file_thumb_path);
        }

        return true;
    }
}
